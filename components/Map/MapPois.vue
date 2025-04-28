<script setup lang="ts">
import type { LngLatLike, Map as MapGL } from 'maplibre-gl'
import { TeritorioCluster } from '@teritorio/maplibre-gl-teritorio-cluster'
import { storeToRefs } from 'pinia'
import { getBBox } from '~/lib/bbox'
import MapBase from '~/components/Map/MapBase.vue'
import type { ApiPoi } from '~/lib/apiPois'
import { MAP_ZOOM } from '~/lib/constants'
import type { MapPoiId } from '~/lib/mapPois'
import { filterRouteByPoiIds } from '~/utils/styles'
import { clusterRender, markerRender, pinMarkerRender } from '~/lib/clusters'
import { mapStore as useMapStore } from '~/stores/map'

const props = withDefaults(defineProps<{
  extraAttributions?: string[]
  offMapAttribution?: boolean
  features: ApiPoi[]
  featureIds?: MapPoiId[]
  fullscreenControl?: boolean
  cluster?: boolean
}>(), {
  extraAttributions: () => [] satisfies string[],
  offMapAttribution: false,
  fullscreenControl: false,
  cluster: true,
})

const POI_SOURCE = 'poi'

const { teritorioCluster } = storeToRefs(useMapStore())

const mapBaseRef = ref<InstanceType<typeof MapBase>>()
const map = ref<MapGL>()

const selectionZoom = computed(() => MAP_ZOOM.selectionZoom)
const bounds = computed(() => getBBox({ type: 'FeatureCollection', features: props.features }))
const center = computed((): LngLatLike | undefined => bounds.value?.getCenter())

function onMapInit(mapInstance: MapGL): void {
  map.value = mapInstance

  teritorioCluster.value = new TeritorioCluster(mapInstance, POI_SOURCE, {
    clusterRenderFn: clusterRender,
    fitBoundsOptions: mapBaseRef.value?.fitBoundsOptions(),
    markerRenderFn: markerRender,
    markerSize: 32,
    pinMarkerRenderFn: pinMarkerRender,
  })
}

function onMapStyleLoad(): void {
  if (map.value && props.featureIds)
    filterRouteByPoiIds(map.value, props.featureIds)

  renderPois()
}

function renderPois(): void {
  if (!mapBaseRef.value)
    return

  const colors = [
    ...new Set(
      props.features.map(
        feature => feature.properties?.display?.color_fill || '#000000',
      ),
    ),
  ]

  mapBaseRef.value.initPoiLayer(props.features.filter(feature => feature.geometry.type === 'Point'), colors, [
    'case',
    ['all', ['has', 'display'], ['has', 'color_fill', ['get', 'display']]],
    ['get', 'color_fill', ['get', 'display']],
    '#000000',
  ], props.cluster)
}
</script>

<template>
  <MapBase
    ref="mapBaseRef"
    :features="features"
    :center="center"
    :bounds="bounds"
    :zoom="selectionZoom.poi"
    :fullscreen-control="fullscreenControl"
    :extra-attributions="extraAttributions"
    :off-map-attribution="offMapAttribution"
    @map-init="onMapInit"
    @map-style-load="onMapStyleLoad"
  />
</template>
