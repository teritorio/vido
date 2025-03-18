<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { MultiPolygon, Polygon } from 'geojson'
import type {
  FitBoundsOptions,
  LngLatBounds,
  MapDataEvent,
  Map as MapGL,
  MapMouseEvent,
} from 'maplibre-gl'
import { storeToRefs } from 'pinia'
import booleanIntersects from '@turf/boolean-intersects'
import { TeritorioCluster } from '@teritorio/maplibre-gl-teritorio-cluster'
import MapControlsExplore from '~/components/MainMap/MapControlsExplore.vue'
import SnackBar from '~/components/MainMap/SnackBar.vue'
import MapBase from '~/components/Map/MapBase.vue'
import MapControls3D from '~/components/Map/MapControls3D.vue'
import MapControlsBackground from '~/components/Map/MapControlsBackground.vue'
import type { ApiMenuCategory } from '~/lib/apiMenu'
import type { ApiPoi } from '~/lib/apiPois'
import { getBBoxFeatures } from '~/lib/bbox'
import { DEFAULT_MAP_STYLE, MAP_ZOOM } from '~/lib/constants'
import { vectorTilesPoi2ApiPoi } from '~/lib/vectorTilesPois'
import { mapStore as useMapStore } from '~/stores/map'
import { menuStore as useMenuStore } from '~/stores/menu'
import { useSiteStore } from '~/stores/site'
import { snackStore as useSnackStore } from '~/stores/snack'
import { filterRouteByCategories, filterRouteByPoiIds } from '~/utils/styles'
import type { LatLng } from '~/utils/types'
import { MapStyleEnum } from '~/utils/types'
import { getHashPart } from '~/utils/url'
import useDevice from '~/composables/useDevice'
import { clusterRender, markerRender, pinMarkerRender } from '~/lib/clusters'

const props = withDefaults(defineProps<{
  defaultBounds: LngLatBounds
  fitBoundsPaddingOptions?: FitBoundsOptions['padding']
  extraAttributions?: string[]
  small?: boolean
  categories: ApiMenuCategory[]
  features: ApiPoi[]
  styleIconFilter?: string[][]
  enableFilterRouteByCategories?: boolean
  enableFilterRouteByFeatures?: boolean
  cooperativeGestures?: boolean
  boundaryArea?: Polygon | MultiPolygon
}>(), {
  fitBoundsPaddingOptions: 50,
  extraAttributions: () => [] satisfies string[],
  small: false,
  enableFilterRouteByCategories: true,
  enableFilterRouteByFeatures: false,
  cooperativeGestures: false,
})
const POI_SOURCE = 'poi'
const STYLE_LAYERS = [
  'poi-level-1',
  'poi-level-2',
  'poi-level-3',
  'features-line',
  'features-fill',
]

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const device = useDevice()
const snackStore = useSnackStore()
const menuStore = useMenuStore()
const { featuresColor, isLoadingFeatures, selectedCategoryIds } = storeToRefs(menuStore)
const siteStore = useSiteStore()
const { config } = siteStore

if (!config)
  throw createError({ statusCode: 500, statusMessage: 'Wrong config', fatal: true })

const { explorerModeEnabled } = storeToRefs(siteStore)
const mapStore = useMapStore()
const { center, selectedFeature, teritorioCluster, mode, selectedFeatureDepsIDs } = storeToRefs(mapStore)
const mapStyleLoaded = ref(false)
const mapBaseRef = ref<InstanceType<typeof MapBase>>()
const map = ref<MapGL>()
const selectedBackground = ref<MapStyleEnum>(DEFAULT_MAP_STYLE)

const availableStyles = computed((): MapStyleEnum[] => {
  const styles = [MapStyleEnum.vector, MapStyleEnum.aerial]

  if (config.BICYCLE_STYLE_URL)
    styles.push(MapStyleEnum.bicycle)

  return styles
})

watch(() => props.features, () => {
  if (!map.value)
    return

  renderPois()
  handleResetMapZoom(t('snack.noPoi.issue'), t('snack.noPoi.action'))
})

watch(selectedCategoryIds, () => showVectorSelectedFeature())

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

  teritorioCluster.value = new TeritorioCluster(map.value, POI_SOURCE, {
    clusterRenderFn: clusterRender,
    fitBoundsOptions: mapBaseRef.value.fitBoundsOptions(),
    // @ts-expect-error: MapGeoJSONFeature type mismatch
    initialFeature: selectedFeature.value ? selectedFeature.value : undefined,
    markerRenderFn: markerRender,
    markerSize: 32,
    pinMarkerRenderFn: pinMarkerRender,
  })

  teritorioCluster.value.addEventListener('feature-click', async (e: Event) => {
    const { query, params, hash } = route
    const selectedFeature = (e as CustomEvent).detail.selectedFeature

    await navigateTo({
      path: `/${params.p1}/${selectedFeature.properties.metadata.id}`,
      query,
      hash,
    })
  })

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

  renderPois()
  showVectorSelectedFeature()
  mapStyleLoaded.value = true
}

// Map interactions
async function onClick(e: MapMouseEvent): Promise<void> {
  if (!map.value)
    return

  const { query, params, hash } = route

  const availableLayers = STYLE_LAYERS.filter(layer => map.value?.getLayer(layer))
  const selectedFeatures = map.value.queryRenderedFeatures(e.point, { layers: availableLayers })

  if (selectedFeatures.length === 0) {
    if (params.poiId) {
      await navigateTo({ path: `/${params.p1}/`, query, hash })
    }
    return
  }

  const selectedFeature = vectorTilesPoi2ApiPoi(selectedFeatures[0])

  await navigateTo({
    path: `/${params.p1}/${selectedFeature.properties.metadata.id}`,
    query,
    hash,
  })
}

function goToSelectedFeature(): void {
  if (!selectedFeature.value || !map.value)
    return

  if (selectedFeature.value.geometry.type === 'Point') {
    let zoom

    if (selectedFeature.value.properties.vido_zoom) {
      zoom = selectedFeature.value.properties.vido_zoom
    }
    else if (selectedFeature.value.properties.vido_cat) {
      zoom = props.categories.find(category => category.id === selectedFeature.value!.properties.vido_cat)?.category.zoom || 17
    }

    map.value.flyTo({
      center: selectedFeature.value.geometry.coordinates as unknown as LatLng,
      zoom: zoom === undefined ? Math.max(map.value.getZoom(), 17) : zoom,
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

  snackStore.showSnack(null)
  resetZoom()

  if (props.features.length) {
    const bounds = getBBoxFeatures(props.features)

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

  if (currentZoom < MAP_ZOOM.zoom.default) {
    resetZoom()
  }
}

function showVectorSelectedFeature(): void {
  if (!map.value)
    return

  if (mode.value === Mode.EXPLORER || mode.value === Mode.FAVORITES) {
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

    if (props.enableFilterRouteByCategories) {
      filterRouteByCategories(map.value, selectedCategoryIds.value)
    }
  }
}

defineExpose({ goToSelectedFeature })
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
      :off-map-attribution="device.smallScreen && !small"
      :hide-control="small"
      :style-icon-filter="styleIconFilter"
      :cooperative-gestures="cooperativeGestures"
      :boundary-area="boundaryArea"
      hash="map"
      @map-init="onMapInit"
      @map-style-load="onMapStyleLoad"
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
