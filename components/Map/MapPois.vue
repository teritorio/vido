<script setup lang="ts">
import type { LngLatLike, Map as MapGL } from 'maplibre-gl'
import { storeToRefs } from 'pinia'
import { getBBox } from '~/lib/bbox'
import MapBase from '~/components/Map/MapBase.vue'
import PoiCardContent from '~/components/PoisCard/PoiCardContent.vue'
import UIButton from '~/components/UI/UIButton.vue'
import type { Poi } from '~/types/local/poi'
import { MAP_ZOOM } from '~/lib/constants'
import type { MapPoiId } from '~/lib/mapPois'
import { filterRouteByPoiIds } from '~/utils/styles'
import { mapStore as useMapStore } from '~/stores/map'
import type { ApiPoi } from '~/types/api/poi'
import { menuStore as useMenuStore } from '~/stores/menu'
import type { PoiUnion } from '~/types/local/poi-deps'

const props = withDefaults(defineProps<{
  extraAttributions?: string[]
  offMapAttribution?: boolean
  features: Poi[]
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
const menuStore = useMenuStore()
const mapStore = useMapStore()
const { teritorioCluster, selectedFeature } = storeToRefs(mapStore)
const poiCompo = usePoi()

const selectionZoom = computed(() => MAP_ZOOM.selectionZoom)
const bounds = computed(() => getBBox({ type: 'FeatureCollection', features: props.features }))
const center = computed((): LngLatLike | undefined => bounds.value?.getCenter())

function onMapInit(mapInstance: MapGL): void {
  map.value = mapInstance

  map.value.on('click', onClick)
}

function onClick(): void {
  mapStore.setSelectedFeature()
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
        feature => feature.properties.display.color_fill || '#000000',
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
    const feature: PoiUnion = (e as CustomEvent).detail.selectedFeature

    const { data, error, status } = await useFetch(
      () => `${apiEndpoint.value}/poi/${feature.properties.metadata.id}.geojson`,
      {
        query: {
          geometry_as: 'point',
          short_description: true,
        },
        transform: (data: ApiPoi) => transformApiPoi(data),
      },
    )

    if (error.value)
      throw createError(error.value)

    if (status.value === 'success' && data.value) {
      mapStore.setSelectedFeature(data.value)
    }
  })
}

function handleClose(): void {
  mapStore.setSelectedFeature()
  teritorioCluster.value?.resetSelectedFeature()
}

function transformApiPoi(feature: ApiPoi): Poi {
  const catId = feature.properties.metadata.category_ids?.[0]

  if (!catId)
    throw createError(`Category ID not found for feature ${feature.properties.metadata.id}.`)

  const category = menuStore.getCurrentCategory(catId)

  if (!category)
    throw createError(`Category ${catId} not found.`)

  return poiCompo.formatPoi(feature, category)
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
      <VNavigationDrawer v-if="selectedFeature" absolute permanent elevation="4" location="start">
        <VCard>
          <template #append>
            <UIButton
              class="close-button"
              color="#ffffff"
              icon="times"
              :title="$t('ui.close')"
              @click="handleClose"
            />
          </template>
          <VCardText>
            <PoiCardContent
              :show-actions="false"
              :show-only-route-action="true"
              :details-is-external="true"
              :poi="selectedFeature"
            />
          </VCardText>
        </VCard>
      </VNavigationDrawer>
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
