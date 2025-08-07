<script setup lang="ts">
import type { ApiPoiDeps, ApiRouteWaypoint } from '~/lib/apiPoiDeps'
import type { ApiPoi } from '~/lib/apiPois'
import MapPois from '~/components/Map/MapPois.vue'
import PoisDeck from '~/components/PoisCard/PoisDeck.vue'
import { ApiRouteWaypointType, iconMap, prepareApiPoiDeps } from '~/lib/apiPoiDeps'

const props = defineProps<{
  poi: ApiPoi
  route: ApiPoiDeps
  colorFill: string
  colorText: string
  colorLine: string
}>()

defineEmits<{
  (e: 'zoomClick', poi: ApiPoi): void
  (e: 'exploreClick', poi: ApiPoi): void
  (e: 'favoriteClick', poi: ApiPoi): void
}>()

const { t } = useI18n()

const deps = ref<ApiPoi[]>([])
const waypoints = ref<ApiRouteWaypoint[]>([])
const pois = ref<ApiPoi[]>([])

const featureDepsIDs = ref<number[]>([])

if (props.poi.properties.metadata.dep_ids) {
  const featureReordered = prepareApiPoiDeps(
    props.route.features,
    props.poi.properties.metadata.dep_ids,
  )

  waypoints.value = featureReordered.waypoints
  pois.value = featureReordered.pois
}

deps.value.push(...pois.value, props.poi)

const apiWaypoints = waypoints.value.map((w, index) => {
  const formattedWaypoint = {
    ...w,
    properties: {
      ...w.properties,
      display: {
        icon: iconMap[w.properties['route:point:type']],
        color_fill: props.colorFill,
        color_text: props.colorText,
        color_line: props.colorLine,
        text: w.properties['route:point:type']
        === ApiRouteWaypointType.way_point
          ? index.toString()
          : undefined,
      },
      editorial: {
        popup_fields: [
          {
            field: 'short_description',
          },
          {
            field: 'coordinates',
            label: true,
          },
        ],
      },
    },
  } as ApiPoi

  deps.value.push(formattedWaypoint)

  return formattedWaypoint
})

deps.value.forEach(d => featureDepsIDs.value.push(d.properties.metadata.id))
</script>

<template>
  <div v-if="deps.length">
    <MapPois
      class="map-pois tw-relative"
      :features="deps"
      :feature-ids="featureDepsIDs"
      :fullscreen-control="true"
      :off-map-attribution="true"
      :cluster="false"
    />
    <div class="detail-wrapper">
      <div v-if="waypoints.length > 0" class="detail-left">
        <h2>{{ t('poiDetails.routes.waypoints') }}</h2>
        <PoisDeck :pois="apiWaypoints" :is-card-light="true" />
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
