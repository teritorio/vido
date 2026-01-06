<script setup lang="ts">
import type { LngLatLike, Map as MapGL } from 'maplibre-gl'
import { storeToRefs } from 'pinia'
import { getBBox } from '~/lib/bbox'
import MapBase from '~/components/Map/MapBase.vue'
import PoiCardContent from '~/components/PoisCard/PoiCardContent.vue'
import UIButton from '~/components/UI/UIButton.vue'
import type { ApiPoiResponse } from '~/types/api/poi'
import { MAP_ZOOM } from '~/lib/constants'
import type { MapPoiId } from '~/lib/mapPois'
import { filterRouteByPoiIds } from '~/utils/styles'
import { mapStore as useMapStore } from '~/stores/map'

const props = withDefaults(defineProps<{
  extraAttributions?: string[]
  offMapAttribution?: boolean
  features: ApiPoiResponse[]
  featureIds?: MapPoiId[]
  fullscreenControl?: boolean
  cluster?: boolean
}>(), {
  extraAttributions: () => [] satisfies string[],
  offMapAttribution: false,
  fullscreenControl: false,
  cluster: true,
})

const apiEndpoint = useState<string>('api-endpoint')
const mapBaseRef = ref<InstanceType<typeof MapBase>>()
const map = ref<MapGL>()
const selectedFeature = ref<ApiPoiResponse | null>(null)

const selectionZoom = computed(() => MAP_ZOOM.selectionZoom)
const bounds = computed(() => getBBox({ type: 'FeatureCollection', features: props.features }))
const center = computed((): LngLatLike | undefined => bounds.value?.getCenter())
const { teritorioCluster } = storeToRefs(useMapStore())

function onMapInit(mapInstance: MapGL): void {
  map.value = mapInstance
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

  teritorioCluster.value?.addEventListener('feature-click', async (e: Event) => {
    const feature: ApiPoiResponse = (e as CustomEvent).detail.selectedFeature

    if (feature.properties['route:point:type']) {
      selectedFeature.value = feature
      return
    }

    const { data, error, status } = await useFetch<ApiPoiResponse>(
      () => `${apiEndpoint.value}/poi/${feature.properties.metadata.id}.geojson`,
      {
        query: {
          geometry_as: 'point',
          short_description: true,
        },
      },
    )

    if (error.value)
      throw createError(error.value)

    if (status.value === 'success' && data.value) {
      selectedFeature.value = data.value
    }
  })
}

function handleClose(): void {
  selectedFeature.value = null
  teritorioCluster.value?.resetSelectedFeature()
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
  >
    <template #drawer>
      <VLayout v-if="selectedFeature">
        <VNavigationDrawer absolute permanent elevation="4" location="start">
          <VCard>
            <template #append>
              <UIButton
                class="close-button"
                color="#ffffff"
                icon="times"
                :title="$t('ui.close')"
                @click=" handleClose"
              />
            </template>
            <VCardText>
              <PoiCardContent
                :show-actions="false"
                :details-is-external="true"
                :poi="selectedFeature"
              />
            </VCardText>
          </VCard>
        </VNavigationDrawer>
      </VLayout>
    </template>
  </MapBase>
</template>

<style lang="css" scoped>
.v-card {
  height: 100%;
}

:deep(.v-card-item) {
  padding-top: 0;
  padding-right: 0;
}

:deep(.v-navigation-drawer__content h2) {
  font-size: 1rem;
}

:deep(.close-button) {
  background-color: rgb(0 0 0 / 55%);
  border-radius: 0 0 0 8px;
  border: 0;
}

:deep(.close-button svg) {
  width: 20px;
  height: 20px;
}
</style>
