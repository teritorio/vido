<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { MultiPolygon, Point, Polygon } from 'geojson'
import type {
  FitBoundsOptions,
  GeoJSONFeature,
  LngLatBounds,
  MapDataEvent,
  Map as MapGL,
  MapMouseEvent,
} from 'maplibre-gl'
import { storeToRefs } from 'pinia'
import booleanIntersects from '@turf/boolean-intersects'
import MapControlsExplore from '~/components/MainMap/MapControlsExplore.vue'
import SnackBar from '~/components/MainMap/SnackBar.vue'
import MapBase from '~/components/Map/MapBase.vue'
import MapControls3D from '~/components/Map/MapControls3D.vue'
import MapControlsBackground from '~/components/Map/MapControlsBackground.vue'
import type { ApiMenuCategory } from '~/types/api/menu'
import type { Poi } from '~/types/local/poi'
import type { ApiPoiDepsCollection, ApiPoiUnion } from '~/types/api/poi-deps'
import type { PoiUnion } from '~/types/local/poi-deps'
import { getBBox } from '~/lib/bbox'
import { DEFAULT_MAP_STYLE, MAP_ZOOM } from '~/lib/constants'
import { vectorTilesPoi2ApiPoi } from '~/lib/vectorTilesPois'
import { mapStore as useMapStore } from '~/stores/map'
import { menuStore as useMenuStore } from '~/stores/menu'
import { useSiteStore } from '~/stores/site'
import { snackStore as useSnackStore } from '~/stores/snack'
import { filterRouteByCategories, filterRouteByPoiIds } from '~/utils/styles'
import type { LanguageCode, LatLng } from '~/utils/types'
import { MapStyleEnum } from '~/utils/types'
import { getHashPart } from '~/utils/url'
import useDevice from '~/composables/useDevice'
import type { ApiPoi } from '~/types/api/poi'

const props = withDefaults(defineProps<{
  defaultBounds: LngLatBounds
  fitBoundsPaddingOptions?: FitBoundsOptions['padding']
  extraAttributions?: string[]
  small?: boolean
  categories: ApiMenuCategory[]
  features: Poi[]
  selectedCategoriesIds?: ApiMenuCategory['id'][]
  styleIconFilter?: string[][]
  enableFilterRouteByCategories?: boolean
  enableFilterRouteByFeatures?: boolean
  cooperativeGestures?: boolean
  boundaryArea?: Polygon | MultiPolygon
}>(), {
  fitBoundsPaddingOptions: 50,
  extraAttributions: () => [] satisfies string[],
  small: false,
  selectedCategoriesIds: () => [] satisfies ApiMenuCategory['id'][],
  enableFilterRouteByCategories: true,
  enableFilterRouteByFeatures: false,
  cooperativeGestures: false,
})

const STYLE_LAYERS = [
  'poi-level-1',
  'poi-level-2',
  'poi-level-3',
  'features-line',
  'features-fill',
]

const router = useRouter()
const { t } = useI18n()
const device = useDevice()
const snackStore = useSnackStore()
const menuStore = useMenuStore()
const { featuresColor, isLoadingFeatures, selectedCategoryIds } = storeToRefs(menuStore)
const { theme, explorerModeEnabled } = storeToRefs(useSiteStore())
const apiEndpoint = useState<string>('api-endpoint')
const mapStore = useMapStore()
const { center, selectedFeature, selectedFeatureDepsIDs, teritorioCluster, mode } = storeToRefs(mapStore)
const mapStyleLoaded = ref(false)
const mapBaseRef = ref<InstanceType<typeof MapBase>>()
const map = ref<MapGL>()
const selectedBackground = ref<MapStyleEnum>(DEFAULT_MAP_STYLE)
const isProcessing = ref(false)
const isZooming = ref(false)
const { locale } = useI18n()
const lang = locale.value as LanguageCode
const poiDepsCompo = usePoiDeps()
const mainPoi = ref<ApiPoi>()

const availableStyles = computed((): MapStyleEnum[] => {
  const styles = [MapStyleEnum.vector, MapStyleEnum.aerial]

  if (theme.value?.map_bicycle_style_url)
    styles.push(MapStyleEnum.bicycle)

  return styles
})

watch(
  () => props.features,
  () => {
    if (!map.value || isProcessing.value)
      return

    showVectorSelectedFeature()
    renderPois()
    handleResetMapZoom(t('snack.noPoi.issue'), t('snack.noPoi.action'))
  },
)

watch(selectedFeature, () => {
  if (isProcessing.value)
    return

  showVectorSelectedFeature()
})

watch(selectedBackground, () => {
  if (!map.value)
    return

  // Re-enable route highlight after style change
  const styledataCallBack = (e: MapDataEvent) => {
    if (e.dataType === 'style') {
      map.value!.off('styledata', styledataCallBack)
      showVectorSelectedFeature()
    }
  }

  map.value.on('styledata', styledataCallBack)
})

onBeforeMount(() => {
  const bg = getHashPart(router, 'bg') as keyof typeof MapStyleEnum
  selectedBackground.value = (bg && MapStyleEnum[bg]) || DEFAULT_MAP_STYLE
})

function onMapInit(mapInstance: MapGL): void {
  map.value = mapInstance

  if (!mapBaseRef.value)
    return

  map.value.on('click', onClick)

  map.value.on('moveend', () => {
    if (!map.value)
      return

    center.value = map.value.getCenter()
  })

  center.value = map.value.getCenter()
}

function renderPois() {
  if (!mapBaseRef.value)
    return

  mapBaseRef.value.initPoiLayer(props.features, featuresColor.value, [
    'case',
    ['all', ['has', 'display'], ['has', 'color_fill', ['get', 'display']]],
    ['get', 'color_fill', ['get', 'display']],
    '#000000',
  ])

  teritorioCluster.value?.addEventListener('feature-click', (e: Event) => updateSelectedFeature((e as CustomEvent).detail.selectedFeature))
}

function onMapStyleLoad(): void {
  STYLE_LAYERS.forEach((layer) => {
    if (!map.value)
      return

    map.value.on('mouseenter', layer, () => {
      if (!map.value)
        return

      map.value.getCanvas().style.cursor = 'pointer'
    })

    map.value.on('mouseleave', layer, () => {
      if (!map.value)
        return

      map.value.getCanvas().style.cursor = ''
    })
  })

  showVectorSelectedFeature()
  renderPois()
  mapStyleLoaded.value = true
}

// Map interactions
function onClick(e: MapMouseEvent): void {
  if (!map.value)
    return

  const vectorSelectedFeatures = map.value!.queryRenderedFeatures(e.point, {
    layers: STYLE_LAYERS.filter(layer => map.value?.getLayer(layer)),
  })

  if (vectorSelectedFeatures.length > 0) {
    updateSelectedFeature(vectorTilesPoi2ApiPoi(vectorSelectedFeatures[0]))
  }
  else {
    updateSelectedFeature()
  }
}

let currentRequestToken: { cancelled: boolean } | null = null

async function updateSelectedFeature(feature?: PoiUnion): Promise<void> {
  // Cancel previous request if it exists
  if (currentRequestToken) {
    currentRequestToken.cancelled = true
  }

  // Create new cancellation token for this request
  const token = { cancelled: false }
  currentRequestToken = token

  if (
    (feature?.properties.metadata.id === selectedFeature.value?.properties.metadata.id)
    || (feature && poiDepsCompo.isWaypoint(feature, lang))
  ) {
    return
  }

  if (!feature) {
    mapStore.setSelectedFeature()
    mapStore.setSelectedFeatureDepsIDs()
  }
  else {
    const id = feature.properties.metadata.id || feature.properties.id || feature.id

    if ((selectedFeature.value?.properties.metadata.id !== id) && !id.toString().includes('_')) {
      isProcessing.value = true
      const isDepSelected = selectedFeatureDepsIDs.value.find(i => i === id)

      // Optimistic UI
      mapStore.setSelectedFeature(menuStore.getFeatureById(id))

      try {
        const { data, error, status } = await useFetch(
          () => `${apiEndpoint.value}/poi/${id}/deps.geojson`,
          {
            query: {
              geometry_as: 'point',
              short_description: true,
            },
            transform: (data: ApiPoiDepsCollection) => transformApiPoiDepsCollection(data, id),
          },
        )

        // Check if this request was cancelled
        if (token.cancelled)
          return

        if (error.value)
          throw createError(error.value)

        if (status.value === 'success' && data.value) {
          if (!isDepSelected) {
            mapStore.setSelectedFeatureDepsIDs()
            data.value.forEach((f) => {
              mapStore.addSelectedFeatureDepsIDs(f.properties.metadata.id)
            })
          }

          if (mainPoi.value) {
            const poi = data.value.find(f => f.properties.metadata.id === mainPoi.value!.properties.metadata.id)
            mapStore.setSelectedFeature(poi as Poi)

            // In case user click on vecto element, attach Pin Marker to POI Marker
            teritorioCluster.value?.setSelectedFeature(poi as unknown as GeoJSONFeature)

            if (poi) {
              const currentCategory = selectedCategoryIds.value.find(id => poi.properties.metadata.category_ids?.includes(id))

              if (!isDepSelected && currentCategory) {
                menuStore.filterByDeps(currentCategory, data.value)

                if (data.value.length > 1)
                  mapStore.setIsDepsView(true)
                else
                  mapStore.setIsDepsView(false)
              }
            }
          }
        }
      }
      catch (e) {
        if (!token.cancelled) {
          console.error('Vido error:', (e as Error).message)
        }
      }
      finally {
        if (!token.cancelled) {
          isProcessing.value = false
        }
      }
    }
    // else {
    //   mapStore.setSelectedFeature(feature)
    // }
  }
}

function getMainPoi(features: ApiPoiUnion[], poiId: number): ApiPoi {
  const poi = features.find(feature => feature.properties.metadata.id === poiId)

  if (!poi)
    throw createError(`Feature with ID: ${poiId} not found.`)

  return poi as ApiPoi
}

function transformApiPoiDepsCollection(data: ApiPoiDepsCollection, poiId: number) {
  poiDepsCompo.resetWaypointIndex()

  if (!data)
    return undefined

  mainPoi.value = getMainPoi(data.features, poiId)
  const catId = mainPoi.value.properties.metadata.category_ids?.[0]

  if (!catId)
    throw createError(`Category ID not found for feature ${poiId}.`)

  const category = menuStore.getCurrentCategory(catId)

  if (!category)
    throw createError(`Category ${catId} not found.`)

  return poiDepsCompo.formatPoiDepsCollection(data, category, 'fr-FR')
}

function goToSelectedFeature(): void {
  if (!selectedFeature.value || !map.value)
    return

  if (selectedFeature.value.geometry.type === 'Point') {
    let zoom: number | undefined

    if (selectedFeature.value.properties.vido_zoom) {
      zoom = selectedFeature.value.properties.vido_zoom
    }
    else if (selectedFeature.value.properties.vido_cat) {
      zoom = props.categories.find(category => category.id === selectedFeature.value!.properties.vido_cat)?.category.zoom || 17
    }

    map.value!.flyTo({
      center: (selectedFeature.value!.geometry as Point).coordinates as unknown as LatLng,
      zoom: zoom === undefined ? Math.max(map.value!.getZoom(), 17) : zoom,
    })
  }
}

function showZoomSnack(text: string, textBtn: string): void {
  snackStore.showSnack({
    time: 5000,
    text,
    textBtn,
  })
}

function handleSnackAction(): void {
  if (!mapBaseRef.value)
    return

  snackStore.showSnack(undefined)
  resetZoom()

  if (props.features.length) {
    const bounds = getBBox({ type: 'FeatureCollection', features: props.features })

    if (bounds)
      mapBaseRef.value.fitBounds(bounds)
  }
}

function resetZoom(): void {
  if (!mapBaseRef.value)
    return

  mapBaseRef.value.fitBounds(props.defaultBounds, { linear: false })
}

function handleResetMapZoom(text: string, textBtn: string): void {
  if (!map.value)
    return

  const mapBound = map.value.getBounds().toArray()
  const bounds = {
    type: 'Polygon',
    coordinates: [[
      [mapBound[0][0], mapBound[0][1]],
      [mapBound[1][0], mapBound[0][1]],
      [mapBound[1][0], mapBound[1][1]],
      [mapBound[0][0], mapBound[1][1]],
      [mapBound[0][0], mapBound[0][1]],
    ]],
  } as Polygon
  const isOneInView = props.features.some(feature => booleanIntersects(bounds, feature.geometry as Exclude<GeoJSON.Geometry, GeoJSON.GeometryCollection>))
  const currentZoom = map.value.getZoom()

  if (!isOneInView && currentZoom >= MAP_ZOOM.zoom.default && props.features.length > 0) {
    showZoomSnack(text, textBtn)
  }

  if (!isZooming.value && currentZoom < MAP_ZOOM.zoom.default) {
    resetZoom()
  }
}

function showVectorSelectedFeature(): void {
  if (!map.value)
    return

  if (mode.value === Mode.EXPLORER) {
    filterRouteByPoiIds(map.value, [])
    return
  }

  if (selectedFeature.value) {
    filterRouteByPoiIds(map.value, selectedFeatureDepsIDs.value)
  }
  else {
    if (props.enableFilterRouteByFeatures) {
      filterRouteByPoiIds(map.value, props.features.map(feature => feature.properties?.metadata?.id || feature.id || feature.properties?.id))
    }
    else if (props.enableFilterRouteByCategories) {
      filterRouteByCategories(map.value, props.selectedCategoriesIds)
    }
  }
}

function onMapZoomStart() {
  isZooming.value = true
}

function onMapZoomEnd() {
  isZooming.value = false
}

defineExpose({ goToSelectedFeature, updateSelectedFeature })
</script>

<template>
  <div class="tw-flex tw-flex-grow">
    <MapBase
      ref="mapBaseRef"
      :bounds="defaultBounds"
      :fit-bounds-padding-options="fitBoundsPaddingOptions"
      :extra-attributions="extraAttributions"
      :features="features"
      :map-style="selectedBackground"
      :rotate="!device.touch"
      :show-attribution="!small"
      :hide-control="small"
      :style-icon-filter="styleIconFilter"
      :cooperative-gestures="cooperativeGestures"
      :boundary-area="boundaryArea"
      hash="map"
      @map-init="onMapInit"
      @map-style-load="onMapStyleLoad"
      @map-zoom-start="onMapZoomStart"
      @map-zoom-end="onMapZoomEnd"
    >
      <template #controls>
        <MapControlsExplore v-if="explorerModeEnabled" :map="map" />
        <MapControls3D :map="map" />
        <MapControlsBackground
          :map="map"
          :backgrounds="availableStyles"
          :initial-background="selectedBackground"
          @change-background="selectedBackground = $event"
        />
      </template>
      <template #body>
        <slot />
      </template>
    </MapBase>
    <SnackBar @click="handleSnackAction" />
    <div
      v-if="isLoadingFeatures"
      class="tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-bg-black tw-bg-opacity-80"
    >
      <FontAwesomeIcon icon="spinner" class="tw-text-zinc-400 tw-animate-spin" size="3x" />
    </div>
  </div>
</template>
