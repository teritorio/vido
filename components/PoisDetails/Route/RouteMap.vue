<script setup lang="ts">
import type { ApiPoiDeps, ApiRouteWaypoint } from '~/lib/apiPoiDeps'
import type { ApiPoi } from '~/lib/apiPois'
import MapPois from '~/components/Map/MapPois.vue'
import PoisDeck from '~/components/PoisCard/PoisDeck.vue'
import { ApiRouteWaypointType, apiRouteWaypointToApiPoi, iconMap } from '~/lib/apiPoiDeps'

const props = defineProps<{
  poi: ApiPoi
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
const featureDepsIDs = ref<number[]>([props.poi.properties.metadata.id])

let index = 1
routeCollection.value = props.route.features.map((feature) => {
  const depID = 'metadata' in feature.properties ? feature.properties.metadata.id : feature.properties.id
  featureDepsIDs.value.push(depID)

  if (feature.properties['route:point:type']) {
    let mapPoi: ApiPoi

    if (!('metadata' in feature.properties)) {
      mapPoi = apiRouteWaypointToApiPoi(
        feature as ApiRouteWaypoint,
        props.colorFill,
        props.colorLine,
        feature.properties['route:point:type']
        === ApiRouteWaypointType.way_point
          ? (index++).toString()
          : undefined,
      )
    }
    else {
      mapPoi = {
        ...feature,
        properties: {
          ...feature.properties,
          display: {
            icon: iconMap[feature.properties['route:point:type']],
            color_fill: feature.properties.display?.color_fill || props.colorFill,
            color_line: feature.properties.display?.color_line || props.colorLine,
            text: feature.properties['route:point:type']
            === ApiRouteWaypointType.way_point
              ? (index++).toString()
              : undefined,
          },
          editorial: {
            popup_fields: feature.properties.editorial?.popup_fields || [
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
      }
    }

    points.value.push(mapPoi)
    return mapPoi
  }
  else {
    const featureApi = feature as ApiPoi

    if ('metadata' in feature.properties && feature.properties.metadata?.id !== props.poi.properties.metadata.id)
      pois.value.push(featureApi)

    return featureApi
  }
})
</script>

<template>
  <div v-if="routeCollection">
    <MapPois
      class="map-pois tw-relative"
      :features="[poi, ...routeCollection]"
      :feature-ids="featureDepsIDs"
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
