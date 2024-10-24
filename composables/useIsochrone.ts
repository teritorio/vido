import type { ExpressionSpecification, LngLatBoundsLike, Map } from 'maplibre-gl'
import type { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson'
import { siteStore as useSiteStore } from '~/stores/site'
import { mapStore as useMapStore } from '~/stores/map'

export const profiles = {
  car: 'driving-car',
  cycle: 'cycling-regular',
  foot: 'foot-walking',
  wheelchair: 'wheelchair',
}

type ProfileKeys = keyof typeof profiles
export type Profile = (typeof profiles)[ProfileKeys]
type ORSData = FeatureCollection<Geometry, GeoJsonProperties> & {
  bbox: LngLatBoundsLike
  metadata: {
    query: {
      profile: Profile
    }
  }
}

export default function useIsochrone() {
  //
  // Composables
  //
  const { config } = useSiteStore()
  const mapStore = useMapStore()
  // Get feature flag for Vido config
  const enabled = (config?.OPEN_ROUTE_SERVICE_KEY && config?.ISOCHRONE) || false
  const { t, locale } = useI18n()
  const map = useState<Map>('map-instance')
  const profile = useState('isochrone-profile')

  //
  // Data
  //
  const isOverlayOpen = ref(false)
  const sources = ref<string[]>([])
  const layers = ref<string[]>([])
  const sourceName = 'isochrone'
  const colorExpression = [
    'match',
    ['get', 'value'],
    900,
    '#00c500',
    1800,
    '#ffac00',
    3600,
    '#ff0000',
    '#000000',
  ] as ExpressionSpecification

  //
  // Methods
  //
  const reset = () => {
    layers.value.forEach(layerId => map.value.removeLayer(layerId))
    layers.value = []

    sources.value.forEach(sourceId => map.value.removeSource(sourceId))
    sources.value = []
  }

  const render = (data: ORSData) => {
    if (map.value) {
      const firstLineLayer = map.value.getStyle().layers.find(layer => layer.type === 'line')?.id

      profile.value = data.metadata.query.profile

      // Apply Isochrone bbox
      map.value.fitBounds(data.bbox)

      // Add Isochrone data source
      map.value.addSource(sourceName, {
        type: 'geojson',
        data: {
          ...data,
          features: data.features.reverse(),
        },
      })

      // Add Isochrone fill layer
      map.value.addLayer({
        id: `${sourceName}-fill`,
        type: 'fill',
        source: sourceName,
        layout: {},
        paint: {
          'fill-color': colorExpression,
          'fill-opacity': 0.1,
        },
      }, firstLineLayer)

      // Add Isochrone line layer
      map.value.addLayer({
        id: `${sourceName}-line`,
        type: 'line',
        source: sourceName,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': colorExpression,
          'line-width': 3,
        },
      })

      // Add Isochrone symbol layer
      map.value.addLayer({
        id: `${sourceName}-symbol`,
        type: 'symbol',
        source: sourceName,
        layout: {
          'symbol-placement': 'line',
          'text-pitch-alignment': 'viewport',
          'text-field': [
            'concat',
            ['/', ['get', 'value'], 60],
            `min - ${t(`isochrone.profiles.${profile.value}`)}`,
          ],
          'text-size': 16,
        },
        paint: {
          'text-color': colorExpression,
          'text-halo-width': 2,
          'text-halo-color': '#ffffff',
        },
      })

      sources.value.push(sourceName)
      layers.value.push(`${sourceName}-fill`)
      layers.value.push(`${sourceName}-line`)
      layers.value.push(`${sourceName}-symbol`)
    }
  }

  const toggleOverlay = () => {
    isOverlayOpen.value = !isOverlayOpen.value
  }

  const fetchIsochrone = async (feature: GeoJSON.Feature, profile: Profile, range: number[] = [900, 1800, 3600]) => {
    reset()

    const { coordinates } = feature.geometry as GeoJSON.Point
    const uniqueID = `isochrone-${profile}-${feature.properties?.metadata.id}`

    const { data, error } = await useAsyncData<ORSData>(
      uniqueID,
      () => $fetch(`https://api.openrouteservice.org/v2/isochrones/${profile}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
          'Authorization': config!.OPEN_ROUTE_SERVICE_KEY!,
          'Content-Type': 'application/json',
        },
        body: {
          id: uniqueID,
          locations: [coordinates],
          range_type: 'time',
          range,
          smoothing: 50,
        },
      }),
    )

    if (error.value)
      throw createError(error.value)

    if (data.value)
      render(data.value)
  }

  //
  // Subscribers
  //
  mapStore.$onAction(({ name, after }) => {
    if (name === 'setSelectedFeature') {
      after((result) => {
        if (result === undefined) {
          reset()
        }
      })
    }
  })

  //
  // Watcher
  //
  watch(locale, (newLocale, oldLocale) => {
    if (newLocale !== oldLocale && map.value.getLayer(`${sourceName}-symbol`)) {
      // Update symbols translation on locale change
      map.value.setLayoutProperty(`${sourceName}-symbol`, 'text-field', [
        'concat',
        ['/', ['get', 'value'], 60],
        `min - ${t(`isochrone.profiles.${profile.value}`)}`,
      ])
    }
  })

  return {
    fetchIsochrone,
    enabled,
    isOverlayOpen,
    toggleOverlay,
    profiles,
  }
}
