<script setup lang="ts">
import { PoiFilter } from '@teritorio/map'
import type { MultiLineString, MultiPoint, MultiPolygon, Polygon } from 'geojson'
import type {
  ExpressionSpecification,
  FitBoundsOptions,
  LayerSpecification,
  LngLatBounds,
  LngLatLike,
  MapDataEvent,
  Map as MapGL,
  MapLibreEvent,
  MapTouchEvent,
  StyleSpecification,
} from 'maplibre-gl'
import { mask } from '@turf/mask'
import { nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { TeritorioCluster } from '@teritorio/maplibre-gl-teritorio-cluster'
import Attribution from '~/components/Map/Attribution.vue'
import Map from '~/components/Map/Map.vue'
import type { Poi } from '~/types/local/poi'
import { MAP_ZOOM } from '~/lib/constants'
import type { MapPoi } from '~/lib/mapPois'
import type { MapStyleEnum } from '~/utils/types'
import { mapStore as useMapStore } from '~/stores/map'
import { clusterRender, markerRender, pinMarkerRender } from '~/lib/clusters'

const props = withDefaults(defineProps<{
  center?: LngLatLike
  bounds?: LngLatBounds
  fitBoundsPaddingOptions?: FitBoundsOptions['padding']
  extraAttributions?: string[]
  features: Poi[]
  fullscreenControl?: boolean
  hash?: string
  mapStyle?: MapStyleEnum
  rotate?: boolean
  showAttribution?: boolean
  offMapAttribution?: boolean
  hideControl?: boolean
  styleIconFilter?: string[][]
  cooperativeGestures?: boolean
  boundaryArea?: Polygon | MultiPolygon
}>(), {
  fitBoundsPaddingOptions: 50,
  extraAttributions: () => [] satisfies string[],
  fullscreenControl: false,
  rotate: false,
  showAttribution: true,
  offMapAttribution: false,
  hideControl: false,
  cooperativeGestures: false,
})

const emit = defineEmits<{
  (e: 'mapInit', map: MapGL): void
  (e: 'mapData', event: MapDataEvent & object): void
  (e: 'mapDragEnd', event: MapLibreEvent<MouseEvent | TouchEvent | undefined> & object): void
  (e: 'mapMoveEnd', event: MapLibreEvent<MouseEvent | TouchEvent | WheelEvent | undefined> & object): void
  (e: 'mapResize', event: MapLibreEvent<undefined> & object): void
  (e: 'mapRotateEnd', event: MapLibreEvent<MouseEvent | TouchEvent | undefined> & object): void
  (e: 'mapTouchMove', event: MapTouchEvent & object): void
  (e: 'mapZoomStart', event: MapLibreEvent<MouseEvent | TouchEvent | WheelEvent | undefined> & object): void
  (e: 'mapZoomEnd', event: MapLibreEvent<MouseEvent | TouchEvent | WheelEvent | undefined> & object): void
  (e: 'mapStyleLoad', style: StyleSpecification): void
}>()

const POI_SOURCE = 'poi'
const POI_LAYER = 'teritorio-cluster-layer'
const BOUNDARY_SOURCE = 'boundary_area'
const BOUNDARY_AREA_LAYER = 'boundary_area'
const BOUNDAR_BORDER_LAYER = 'boundary_border'

const { boundOptions, teritorioCluster, selectedFeature } = storeToRefs(useMapStore())

const map = ref<MapGL>()
const poiFilter = ref<PoiFilter>()
const poiLayerTemplate = ref<LayerSpecification>()
const fullAttribution = ref<string>()

const selectionZoom = computed(() => MAP_ZOOM.selectionZoom)

watch(
  () => props.fitBoundsPaddingOptions,
  () => {
    if (!boundOptions)
      return

    boundOptions.value = fitBoundsOptions()
    teritorioCluster.value?.setBoundsOptions(boundOptions.value)
  },
  { immediate: true },
)

watch(
  () => props.offMapAttribution,
  async () => {
    await nextTick(() => {
      if (!map.value)
        return

      map.value.resize()
    })
  },
)

watch(
  () => props.styleIconFilter,
  (newValue) => {
    if (!poiFilter.value)
      return

    if (newValue)
      poiFilter.value.setIncludeFilter(newValue)
    else
      poiFilter.value.remove(true)
  },
)

function fitBoundsOptions(options: FitBoundsOptions = {}): FitBoundsOptions {
  return {
    maxZoom: 17,
    padding: props.fitBoundsPaddingOptions,
    ...options,
  }
}

function fitBounds(bounds: LngLatBounds, options: FitBoundsOptions = {}): void {
  if (!map.value)
    return

  map.value.fitBounds(bounds, fitBoundsOptions(options))
}

function featuresPrepare(features: Poi[]): Poi[] {
  return features.map((feature) => {
    if (feature.geometry && ['MultiPoint', 'MultiLineString', 'MultiPolygon'].includes(feature.geometry.type)) {
      return (feature.geometry as (MultiPoint | MultiLineString | MultiPolygon)).coordinates.map(coordinates => ({
        type: 'Feature',
        properties: feature.properties,
        geometry: {
          type: feature.geometry.type.substring(5) as ('Point' | 'LineString' | 'Polygon'),
          coordinates,
        },
      } as Poi))
    }
    else {
      return [feature]
    }
  })
    .flat()
    .filter(feature => !!feature)
    .map((feature, index) => {
      feature.id = index
      return feature
    })
}

function initPoiLayer(features: MapPoi[], clusterPropertiesValues: string[], clusterPropertiesKeyExpression: ExpressionSpecification, cluster?: boolean): void {
  if (!map.value)
    return

  if (map.value.getLayer(POI_LAYER))
    map.value.removeLayer(POI_LAYER)

  if (map.value.getSource(POI_SOURCE))
    map.value.removeSource(POI_SOURCE)

  // Create cluster properties, which will contain count of features per category
  const clusterProps: { [category: string]: object } = {}

  clusterPropertiesValues.forEach((clusterPropertiesValue) => {
    clusterProps[clusterPropertiesValue] = [
      '+',
      [
        'case',
        ['==', clusterPropertiesKeyExpression, clusterPropertiesValue],
        1,
        0,
      ],
    ]
  })

  if (!('#000000' in clusterProps)) {
    clusterProps['#000000'] = [
      '+',
      ['case', ['==', clusterPropertiesKeyExpression, null], 1, 0],
    ]
  }

  map.value.addSource(POI_SOURCE, {
    type: 'geojson',
    cluster: cluster === undefined ? true : cluster,
    clusterRadius: 64,
    clusterProperties: clusterProps,
    clusterMaxZoom: 22,
    tolerance: 0.6,
    maxzoom: 24,
    data: {
      type: 'FeatureCollection',
      features: featuresPrepare(features as Poi[]),
    },
  })

  teritorioCluster.value = new TeritorioCluster(POI_LAYER, POI_SOURCE, {
    clusterRender,
    fitBoundsOptions: fitBoundsOptions(),
    // @ts-expect-error: MapGeoJSONFeature type mismatch
    initialFeature: selectedFeature.value ? selectedFeature.value : undefined,
    markerRender,
    markerSize: 32,
    pinMarkerRender,
  })

  map.value.addLayer(teritorioCluster.value)
}

function onMapInit(mapInstance: MapGL): void {
  map.value = mapInstance
  useState('map-instance', () => map)
  emit('mapInit', map.value)
}

function onMapStyleLoad(style: StyleSpecification): void {
  if (!map.value)
    return

  poiLayerTemplate.value = style.layers.find(
    layer => layer.id === 'poi-level-1',
  )

  poiFilter.value = new PoiFilter({
    filter: props.styleIconFilter || [],
  })

  map.value.addControl(poiFilter.value)

  if (props.boundaryArea) {
    if (!map.value.getSource(BOUNDARY_SOURCE)) {
      map.value.addSource(BOUNDARY_SOURCE, {
        type: 'geojson',
        data: mask(props.boundaryArea),
      })
    }

    const firstSymbolLayerId = map.value.getStyle().layers.find(layer => layer.type === 'line')?.id

    map.value.addLayer({
      id: BOUNDARY_AREA_LAYER,
      source: BOUNDARY_SOURCE,
      type: 'fill',
      paint: {
        'fill-color': 'rgba(185, 185, 185, 0.46)',
        'fill-opacity': 0.8,
      },
    }, firstSymbolLayerId)

    map.value.addLayer({
      id: BOUNDAR_BORDER_LAYER,
      source: BOUNDARY_SOURCE,
      type: 'line',
      paint: {
        'line-color': 'rgba(185, 185, 185, 0.46)',
        'line-width': 3,
      },
    }, firstSymbolLayerId)
  }

  emit('mapStyleLoad', style)
}

function onMapRender(eventName: 'mapData' | 'mapDragEnd' | 'mapMoveEnd' | 'mapResize' | 'mapRotateEnd' | 'mapTouchMove' | 'mapZoomEnd' | 'mapZoomStart', event: any): void {
  // @ts-expect-error: eventName is not in events definition
  emit(eventName, event)
}

defineExpose({ fitBounds, initPoiLayer, featuresPrepare, fitBoundsOptions })
</script>

<template>
  <div id="map-container" class="tw-w-full tw-h-full tw-flex tw-flex-col">
    <Map
      :center="center" :bounds="bounds" :fit-bounds-options="fitBoundsOptions()" :zoom="selectionZoom.poi"
      :fullscreen-control="fullscreenControl" :extra-attributions="extraAttributions" :map-style="mapStyle"
      :rotate="rotate" :show-attribution="showAttribution && !offMapAttribution" :hide-control="hideControl"
      :hash="hash" :cooperative-gestures="cooperativeGestures" class="tw-grow tw-h-full" @map-init="onMapInit($event)"
      @map-data="onMapRender('mapData', $event)" @map-drag-end="onMapRender('mapDragEnd', $event)"
      @map-move-end="onMapRender('mapMoveEnd', $event)" @map-resize="onMapRender('mapResize', $event)"
      @map-rotate-end="onMapRender('mapRotateEnd', $event)" @map-touch-move="onMapRender('mapTouchMove', $event)"
      @map-zoom-end="onMapRender('mapZoomEnd', $event)" @map-zoom-start="onMapRender('mapZoomStart', $event)" @map-style-load="onMapStyleLoad($event)"
      @full-attribution="fullAttribution = $event"
    >
      <template #controls>
        <slot name="controls" />
      </template>
      <template #body>
        <slot name="body" />
      </template>
      <slot name="drawer" />
    </Map>
    <Attribution v-if="showAttribution && offMapAttribution" :attribution="fullAttribution" />
  </div>
</template>

<style scoped>
:deep(.cluster-donut) {
  @apply tw-text-sm tw-leading-none tw-font-medium tw-block tw-text-zinc-800;
}
</style>
