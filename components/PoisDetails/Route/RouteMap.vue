<script setup lang="ts">
import type { ApiPoiDeps, ApiRouteWaypoint } from '~/lib/apiPoiDeps'
import type { ApiPoi, ApiPoiId } from '~/lib/apiPois'
import MapPois from '~/components/Map/MapPois.vue'
import PoisDeck from '~/components/PoisCard/PoisDeck.vue'
import { ApiRouteWaypointType, apiRouteWaypointToApiPoi } from '~/lib/apiPoiDeps'

const props = defineProps<{
  poiId: ApiPoiId
  route: ApiPoiDeps
  colorFill: string
  colorLine: string
}>()

defineEmits<{
  (e: 'zoomClick', poi: ApiPoi): void
  (e: 'exploreClick', poi: ApiPoi): void
  (e: 'favoriteClick', poi: ApiPoi): void
}>()

const { t } = useI18n()

const routeCollection = ref<ApiPoi[] | null>(null)
const points = ref<ApiPoi[]>([])
const pois = ref<ApiPoi[]>([])

let index = 1
routeCollection.value = props.route.features.map((feature) => {
  if (feature.properties['route:point:type'] && !('metadata' in feature.properties)) {
    const mapPoi = apiRouteWaypointToApiPoi(
      feature as ApiRouteWaypoint,
      props.colorFill,
      props.colorLine,
      feature.properties['route:point:type']
      === ApiRouteWaypointType.way_point
        ? (index++).toString()
        : undefined,
    )
    points.value.push(mapPoi)
    return mapPoi
  }
  else {
    const featureApi = feature as ApiPoi
    if ('metadata' in feature.properties && feature.properties.metadata?.id !== props.poiId)
      pois.value.push(featureApi)

    return featureApi
  }
})
</script>

<template>
  <div v-if="routeCollection">
    <MapPois
      class="map-pois tw-relative"
      :features="routeCollection"
      :feature-ids="[poiId]"
      :fullscreen-control="true"
      :off-map-attribution="true"
      :cluster="false"
    />
    <div class="detail-wrapper">
      <div v-if="points.length > 0" class="detail-left">
        <h2>{{ t('poiDetails.routes.waypoints') }}</h2>
        <PoisDeck :pois="points" :is-card-light="true" />
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
