<script setup lang="ts">
import type { PoiUnion } from '~/types/local/poi-deps'
import type { Poi } from '~/types/local/poi'
import MapPois from '~/components/Map/MapPois.vue'
import PoisDeck from '~/components/PoisCard/PoisDeck.vue'

const props = defineProps<{
  poi: Poi
  poiDeps: PoiUnion[]
  colorFill: string
  colorText: string
}>()

defineEmits<{
  (e: 'zoomClick', poi: Poi): void
  (e: 'exploreClick', poi: Poi): void
  (e: 'favoriteClick', poi: Poi): void
}>()

const { t } = useI18n()
const poiDepsCompo = usePoiDeps()

const featureDepsIDs = computed(() => {
  const ids = [props.poi.properties.metadata.id]

  props.poiDeps.map(f => ids.push(f.properties.metadata.id))

  return ids
})

const formattedFeatures = computed(() => {
  return [props.poi, ...props.poiDeps].map((f) => {
    f.properties.editorial.popup_fields = [
      {
        field: 'short_description',
        render: 'text',
      },
      {
        field: 'coordinates',
        render: 'coordinates',
        label: true,
      },
    ]

    return f
  })
})

const waypoints = computed(() => props.poiDeps.filter(f => poiDepsCompo.isWaypoint(f)))
const pois = computed(() => props.poiDeps.filter(f => !poiDepsCompo.isWaypoint(f)))
</script>

<template>
  <div>
    <MapPois
      class="map-pois tw-relative"
      :features="formattedFeatures"
      :feature-ids="featureDepsIDs"
      :fullscreen-control="true"
      :off-map-attribution="true"
      :cluster="false"
    />
    <div class="detail-wrapper">
      <div v-if="waypoints.length > 0" class="detail-left">
        <h2>{{ t('poiDetails.routes.waypoints') }}</h2>
        <PoisDeck :pois="waypoints" :is-card-light="true" />
      </div>
      <div v-if="pois.length > 0" class="detail-right">
        <h2>{{ t('poiDetails.routes.pois') }}</h2>
        <PoisDeck :pois="pois" :is-card-light="true" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.map-pois {
  margin: 0 0 4rem;
}

.detail-wrapper {
  position: relative;
  display: flex;
  box-sizing: border-box;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;

  .detail-left {
    width: 34%;
    box-sizing: border-box;
    margin: 0 0 4rem;
    padding: 0 1.6rem;
  }

  .detail-right {
    width: 66%;
    margin: 0 0 4rem;
    padding-left: 3.3rem;
  }
}

@media (width <= 991px) {
  .detail-wrapper {
    flex-direction: column;

    .detail-left,
    .detail-right {
      width: 100%;
      padding: 0 1.6rem;
    }
  }
}

:deep(#map-container) {
  width: 100%;
  height: 500px;
}
</style>
