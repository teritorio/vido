import { defineStore, storeToRefs } from 'pinia'
import type { FitBoundsOptions, MapGeoJSONFeature } from 'maplibre-gl'
import type { TeritorioCluster } from '@teritorio/maplibre-gl-teritorio-cluster'
import { useSiteStore } from '~/stores/site'
import { menuStore as useMenuStore } from '~/stores/menu'
import type { ApiPoi, ApiPoiProperties } from '~/lib/apiPois'
import type { LatLng, Pitch } from '~/utils/types'
import { Mode } from '~/utils/types'
import type { ApiPoiDeps, ApiRouteWaypoint } from '~/lib/apiPoiDeps'
import { ApiRouteWaypointType, apiRouteWaypointToApiPoi } from '~/lib/apiPoiDeps'

function isJsonObject(item: string): boolean {
  let value = false
  try {
    value = JSON.parse(item)
  }
  catch (e) {
    return false
  }

  return typeof value === 'object' && value !== null
}

function formatSelectedFeature(feature: ApiPoi): ApiPoi {
  const goodFeature = feature

  if (feature.properties) {
    const cleanProperties: ApiPoiProperties = {} as ApiPoiProperties

    Object.keys(feature.properties).forEach((key) => {
      if (isJsonObject(feature.properties[key]))
        cleanProperties[key] = JSON.parse(feature.properties[key])
      else cleanProperties[key] = feature.properties[key]
    })

    goodFeature.properties = cleanProperties
  }

  return goodFeature
}

export const mapStore = defineStore('map', () => {
  const boundOptions = ref<FitBoundsOptions>()
  const center = ref<LatLng>({ lng: 0, lat: 0 })
  const mode = ref<Mode>(Mode.BROWSER)
  const pitch = ref<Pitch>(0)
  const selectedFeature = ref<ApiPoi | null>(null)
  const teritorioCluster = ref<TeritorioCluster | null>(null)
  const selectedFeatureDepsIDs = ref<number[]>([])

  const isModeExplorer = computed(() => mode.value === Mode.EXPLORER)
  const isModeFavorites = computed(() => mode.value === Mode.FAVORITES)
  const isModeExplorerOrFavorites = computed(() => mode.value === Mode.EXPLORER || mode.value === Mode.FAVORITES)

  const route = useRoute()
  const { config } = useSiteStore()
  const menuStore = useMenuStore()
  const { selectedCategoryIds } = storeToRefs(menuStore)

  if (!config)
    throw createError({ statusCode: 500, statusMessage: 'Wrong config', fatal: true })

  const { API_ENDPOINT, API_PROJECT, API_THEME } = config
  async function setSelectedFeature(feature?: ApiPoi) {
    selectedFeatureDepsIDs.value = []

    if (!feature) {
      await menuStore.fetchFeatures({
        vidoConfig: config!,
        categoryIds: selectedCategoryIds.value,
        clipingPolygonSlug: route.query.clipingPolygonSlug?.toString(),
      })
      selectedFeature.value = null
      teritorioCluster.value?.resetSelectedFeature()
    }
    else {
      if (
        selectedFeature.value?.properties.metadata.id === feature.properties.metadata.id
        || feature.properties['route:point:type']
      ) {
        return
      }

      const id = feature.properties.metadata.id || feature.properties.id
      const { data, error, status } = await useFetch<ApiPoiDeps>(
        () => `${API_ENDPOINT}/${API_PROJECT}/${API_THEME}/poi/${id}/deps.geojson`,
        {
          query: {
            geometry_as: 'point_or_bbox',
            short_description: false,
          },
        },
      )

      if (error.value)
        throw createError(error.value)

      if (status.value === 'success' && data.value) {
        let poi: ApiPoi | undefined
        const deps = [] as ApiPoi[]
        let waypointIndex = 1

        data.value.features.forEach((f) => {
          const depID = 'metadata' in f.properties ? f.properties.metadata.id : f.properties.id
          selectedFeatureDepsIDs.value.push(depID)

          f = {
            ...f,
            properties: {
              ...f.properties,
              vido_visible: true,
            },
          }

          if (id === depID) {
            poi = f as ApiPoi
          }

          if (f.properties['route:point:type']) {
            f = apiRouteWaypointToApiPoi(
              f as ApiRouteWaypoint,
              poi?.properties.display?.color_fill || '#76009E',
              poi?.properties.display?.color_line || '#76009E',
              f.properties['route:point:type'] === ApiRouteWaypointType.way_point
                ? (waypointIndex++).toString()
                : undefined,
            )
          }

          if (f.geometry.type === 'Point') {
            deps.push(f as ApiPoi)
          }
        })

        if (!poi)
          throw createError(`Feature with ID: ${id} not found.`)

        selectedFeature.value = formatSelectedFeature(poi)
        // In case user click on vecto element, attach Pin Marker to POI Marker
        teritorioCluster.value?.setSelectedFeature(poi as unknown as MapGeoJSONFeature)

        if (poi.properties.metadata.category_ids?.length)
          menuStore.filterByDeps(poi.properties.metadata.category_ids, deps)
      }
    }
  }

  return {
    boundOptions,
    center,
    mode,
    pitch,
    selectedFeature,
    teritorioCluster,
    selectedFeatureDepsIDs,
    isModeExplorer,
    isModeFavorites,
    isModeExplorerOrFavorites,
    setSelectedFeature,
  }
})
