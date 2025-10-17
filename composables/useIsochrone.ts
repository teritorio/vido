import type { ExpressionSpecification, LngLatBoundsLike, Map } from 'maplibre-gl'
import type { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson'
import { storeToRefs } from 'pinia'
import { useSiteStore } from '~/stores/site'
import { mapStore as useMapStore } from '~/stores/map'

export const profiles = {
  car: 'driving-car',
  bicycle: 'cycling-regular',
  foot: 'foot-walking',
  wheelchair: 'wheelchair',
}

export type ProfileKeys = keyof typeof profiles
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
  const { openRouteServiceKey } = useRuntimeConfig().public
  const { config } = useSiteStore()
  // Get feature flag for Vido config
  const enabled = (openRouteServiceKey && config?.ISOCHRONE) || false
  const { t, locale } = useI18n()
  const map = useState<Map>('map-instance')
  const profile = useState<Profile | null>('isochrone-profile', () => null)
  const layers = useState<string[]>('isochrone-layers', () => [])
  const isochroneCurrentFeature = useState<GeoJSON.Feature | null>(() => null)
  const { boundOptions } = storeToRefs(useMapStore())

  //
  // Data
  //
  const isOverlayOpen = ref(false)
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

    if (map.value.getSource(sourceName))
      map.value.removeSource(sourceName)

    isochroneCurrentFeature.value = null
  }

  const render = (data: ORSData) => {
    if (map.value) {
      const firstLineLayer = map.value.getStyle().layers.find(layer => layer.type === 'line')?.id

      profile.value = data.metadata.query.profile

      // Apply Isochrone bbox
      map.value.fitBounds(data.bbox, boundOptions?.value)

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

    if (feature.geometry.type !== 'Point')
      return

    const { coordinates } = feature.geometry
    const uniqueID = `isochrone-${profile}-${feature.properties?.metadata.id}`

    const { data, error } = await useAsyncData<ORSData>(
      uniqueID,
      () => $fetch(`https://api.openrouteservice.org/v2/isochrones/${profile}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
          'Authorization': openRouteServiceKey,
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

    if (data.value) {
      isochroneCurrentFeature.value = feature
      render(data.value)
    }
  }

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
    isochroneCurrentFeature,
    fetchIsochrone,
    enabled,
    isOverlayOpen,
    toggleOverlay,
    profiles,
    reset,
  }
}
