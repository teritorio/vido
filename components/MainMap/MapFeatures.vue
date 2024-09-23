<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { MultiPolygon, Polygon } from 'geojson'
import debounce from 'lodash.debounce'
import type {
  FitBoundsOptions,
  GeoJSONSource,
  LngLatBoundsLike,
  Map,
  MapDataEvent,
  MapMouseEvent,
  Marker,
} from 'maplibre-gl'
import { storeToRefs } from 'pinia'
import booleanIntersects from '@turf/boolean-intersects'
import MapControlsExplore from '~/components/MainMap/MapControlsExplore.vue'
import SnackBar from '~/components/MainMap/SnackBar.vue'
import MapBase from '~/components/Map/MapBase.vue'
import MapControls3D from '~/components/Map/MapControls3D.vue'
import MapControlsBackground from '~/components/Map/MapControlsBackground.vue'
import type { ApiMenuCategory } from '~/lib/apiMenu'
import type { ApiPoi } from '~/lib/apiPois'
import { getPoiById } from '~/lib/apiPois'
import { getBBoxFeature, getBBoxFeatures } from '~/lib/bbox'
import { DEFAULT_MAP_STYLE, MAP_ZOOM } from '~/lib/constants'
import type { VectorTilesPoi } from '~/lib/vectorTilesPois'
import { vectorTilesPoi2ApiPoi } from '~/lib/vectorTilesPois'
import { mapStore as useMapStore } from '~/stores/map'
import { menuStore as useMenuStore } from '~/stores/menu'
import { siteStore as useSiteStore } from '~/stores/site'
import { snackStore as useSnackStore } from '~/stores/snack'
import { filterRouteByCategories, filterRouteByPoiIds } from '~/utils/styles'
import type { LatLng } from '~/utils/types'
import { MapStyleEnum } from '~/utils/types'
import { getHashPart } from '~/utils/url'
import useDevice from '~/composables/useDevice'

//
// Props
//
const props = withDefaults(defineProps<{
  boundaryArea?: Polygon | MultiPolygon
  categories: ApiMenuCategory[]
  cooperativeGestures?: boolean
  defaultBounds: LngLatBoundsLike
  enableFilterRouteByCategories?: boolean
  enableFilterRouteByFeatures?: boolean
  explorerModeEnabled: boolean
  extraAttributions?: string[]
  features?: ApiPoi[]
  fitBoundsPaddingOptions?: FitBoundsOptions['padding']
  selectedCategoriesIds: ApiMenuCategory['id'][]
  small?: boolean
  styleIconFilter?: Array<string[]>
}>(), {
  cooperativeGestures: false,
  enableFilterRouteByCategories: true,
  enableFilterRouteByFeatures: false,
  features: () => [] as ApiPoi[],
  fitBoundsPaddingOptions: 50,
  small: false,
})

//
// Composables
//
const router = useRouter()
const { t } = useI18n()
const device = useDevice()
const snackStore = useSnackStore()
const { config } = useSiteStore()
const { isLoadingFeatures } = storeToRefs(useMenuStore())
const mapStore = useMapStore()
const { center, selectedFeature } = storeToRefs(mapStore)

//
// Data
//
const map = ref<Map>()
const mapBase = ref<InstanceType<typeof MapBase>>()
const mapStyleLoaded = ref(false)
const selectedBackground = ref<MapStyleEnum>(DEFAULT_MAP_STYLE)
const selectedFeatureMarker = ref<Marker>()
const STYLE_LAYERS = [
  'poi-level-1',
  'poi-level-2',
  'poi-level-3',
  'features-line',
  'features-fill',
]
const POI_SOURCE = 'poi'

//
// Hooks
//
onBeforeMount(() => {
  const bg = getHashPart(router, 'bg') as keyof typeof MapStyleEnum
  selectedBackground.value = (bg && MapStyleEnum[bg]) || DEFAULT_MAP_STYLE
})

//
// Computed
//
const availableStyles = computed(() => {
  return [MapStyleEnum.vector, MapStyleEnum.aerial, MapStyleEnum.bicycle]
})

// Store Subscribers
mapStore.$onAction(({ name, after }) => {
  if (name === 'setSelectedFeature') {
    after(() => showSelectedFeature())
  }
})

//
// Watchers
//
watch(props.features, () => {
  if (!map.value)
    return

  // Change visible data
  const source = map.value.getSource(POI_SOURCE)

  if (source?.type === 'geojson' && 'setData' in source) {
    (source as GeoJSONSource).setData({
      type: 'FeatureCollection',
      features: mapBase.value!.featuresPrepare(props.features),
    })

    showSelectedFeature()
  }

  handleResetMapZoom(t('snack.noPoi.issue'), t('snack.noPoi.action'))

  if (props.enableFilterRouteByFeatures) {
    filterRouteByPoiIds(
      map.value,
      props.features.map(
        feature =>
          feature.properties?.metadata?.id
          || feature.id
          || feature.properties?.id,
      ),
    )
  }
})

watch(props.selectedCategoriesIds, (newCategories) => {
  if (props.enableFilterRouteByCategories)
    filterRouteByCategories(map.value!, newCategories)
})

watch(selectedBackground, () => {
  // Only once map is loaded. Can be called from beforeMount().
  if (map.value) {
    // Re-enable route highlight after style change
    const styledataCallBack = (e: MapDataEvent) => {
      if (e.dataType === 'style') {
        map.value!.off('styledata', styledataCallBack)
        showSelectedFeature()
      }
    }

    map.value.on('styledata', styledataCallBack)
  }
})

//
// Methods
//
function onMapInit(mapInstance: Map) {
  map.value = mapInstance

  map.value.on('click', onClick)

  center.value = map.value.getCenter()
  map.value.on('moveend', () => {
    center.value = map.value!.getCenter()
  })
}

function onMapStyleLoad() {
  const colors = [
    ...new Set(
      props.categories
        .filter(category => category.category)
        .map(category => category.category.color_fill),
    ),
  ]

  mapBase.value!.initPoiLayer(props.features, colors, [
    'case',
    ['all', ['has', 'display'], ['has', 'color_fill', ['get', 'display']]],
    ['get', 'color_fill', ['get', 'display']],
    '#000000',
  ])

  STYLE_LAYERS.forEach((layer) => {
    map.value!.on('mouseenter', layer, () => {
      map.value!.getCanvas().style.cursor = 'pointer'
    })
    map.value!.on('mouseleave', layer, () => {
      map.value!.getCanvas().style.cursor = ''
    })
  })

  showSelectedFeature()
  mapStyleLoaded.value = true
}

function onClick(e: MapMouseEvent) {
  let selectedFeatures = STYLE_LAYERS.map((layerId) => {
    return map.value!.queryRenderedFeatures(e.point, {
      layers: [layerId],
    }) as unknown as VectorTilesPoi[]
  }).flat()

  selectedFeatures = selectedFeatures.filter(
    feature => feature.properties.popup_fields,
  )

  if (selectedFeatures.length > 0) {
    // Set temp partial data from vector tiles. Then fetch full data
    updateSelectedFeature(vectorTilesPoi2ApiPoi(selectedFeatures[0]), undefined, true)
    showSelectedFeature()
  }
  else {
    updateSelectedFeature()
  }
}

function updateSelectedFeature(feature?: ApiPoi, marker?: Marker, fetch = false) {
  if (selectedFeature.value !== feature) {
    mapStore.setSelectedFeature(feature)
    setSelectedFeatureMarker(marker)

    if (feature && fetch && feature.properties.metadata.id) {
      try {
        // Seted temp partial data from vector tiles.
        // Now fetch full data.
        return getPoiById(
          config!,
          feature.properties.metadata.id,
        ).then((apiPoi) => {
          // Overide geometry.
          // Keep same original location to avoid side effect on moving selected object.
          apiPoi.geometry = feature.geometry
          mapStore.setSelectedFeature(apiPoi)
        })
      }
      catch (e) {
        console.error('Vido error:', (e as Error).message)
      }
    }
  }
}

function onMapRender() {
  if (mapStyleLoaded.value && selectedFeature.value) {
    const marker = createMarker((selectedFeature.value.geometry as GeoJSON.Point).coordinates as [number, number])
    setSelectedFeatureMarker(marker)
  }
}

function goTo(feature: ApiPoi) {
  if (!feature || !('coordinates' in feature.geometry))
    return

  mapBase.value!.fitBounds(getBBoxFeature(feature))
}

function goToSelectedFeature() {
  if (selectedFeature.value?.geometry.type === 'Point') {
    let zoom

    if (selectedFeature.value.properties.vido_zoom) {
      zoom = selectedFeature.value.properties.vido_zoom
    }
    else if (selectedFeature.value.properties.vido_cat) {
      zoom = props.categories.find(category => category.id === selectedFeature.value!.properties.vido_cat)?.category.zoom || 17
    }

    map.value!.flyTo({
      center: selectedFeature.value.geometry.coordinates as unknown as LatLng,
      zoom: zoom === undefined ? Math.max(map.value!.getZoom(), 17) : zoom,
    })
  }
}

function showZoomSnack(text: string, textBtn: string) {
  snackStore.showSnack({
    time: 5000,
    text,
    textBtn,
  })
}

function handleSnackAction() {
  snackStore.showSnack(null)
  resetZoom()

  if (props.features) {
    const bounds = getBBoxFeatures(props.features)

    if (bounds)
      mapBase.value!.fitBounds(bounds)
  }
}

function resetZoom() {
  mapBase.value!.fitBounds(props.defaultBounds, { linear: false })
}

function handleResetMapZoom(text: string, textBtn: string) {
  const mapBound = map.value!.getBounds().toArray()
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
  const currentZoom = map.value!.getZoom()

  if (
    !isOneInView
    && currentZoom >= MAP_ZOOM.zoom.default
    && props.features.length > 0
  ) {
    showZoomSnack(text, textBtn)
  }

  if (currentZoom < MAP_ZOOM.zoom.default)
    resetZoom()
}

function showSelectedFeature() {
  if (
    selectedFeature.value
    && (selectedFeature.value.properties?.metadata?.id
    || selectedFeature.value.id
    || selectedFeature.value.properties?.id)
  ) {
    filterRouteByPoiIds(map.value!, [
      selectedFeature.value.properties?.metadata?.id
      || selectedFeature.value.id
      || selectedFeature.value.properties?.id,
    ])
  }
  else {
    if (props.enableFilterRouteByFeatures) {
      filterRouteByPoiIds(
        map.value!,
        props.features.map(
          feature =>
            feature.properties?.metadata?.id
            || feature.id
            || feature.properties?.id,
        ),
      )
    }

    if (props.enableFilterRouteByCategories)
      filterRouteByCategories(map.value!, props.selectedCategoriesIds)
  }
}

function setSelectedFeatureMarker(marker?: Marker) {
  selectedFeatureMarker.value?.remove()
  selectedFeatureMarker.value = marker?.addTo(map.value!)
}

//
// Expose
//
defineExpose({
  goTo,
  goToSelectedFeature,
})

debounce(updateSelectedFeature, 300)
</script>

<template>
  <div class="tw-flex tw-flex-grow">
    <MapBase
      ref="mapBase" :features="features" :bounds="defaultBounds"
      :fit-bounds-padding-options="fitBoundsPaddingOptions" :extra-attributions="extraAttributions"
      :map-style="selectedBackground" :rotate="!device.touch" :show-attribution="!small"
      :off-map-attribution="device.smallScreen && !small" :hide-control="small" :style-icon-filter="styleIconFilter"
      :cooperative-gestures="cooperativeGestures" :boundary-area="boundaryArea" hash="map" @map-init="onMapInit"
      @map-data="onMapRender" @map-drag-end="onMapRender" @map-move-end="onMapRender" @map-resize="onMapRender"
      @map-rotate-end="onMapRender" @map-touch-move="onMapRender" @map-zoom-end="onMapRender"
      @map-style-load="onMapStyleLoad" @feature-click="updateSelectedFeature"
    >
      <template #controls>
        <MapControlsExplore v-if="explorerModeEnabled" :map="map" />
        <MapControls3D :map="map" />
        <MapControlsBackground
          :map="map" :backgrounds="availableStyles" :initial-background="selectedBackground"
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
