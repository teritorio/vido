<template>
  <div v-if="routeCollection">
    <MapPois
      class="map-pois relative"
      :features="routeCollection"
      :feature-ids="[poiId]"
      :fullscreen-control="true"
      :off-map-attribution="true"
    />
    <div class="detail-wrapper">
      <div v-if="points.length > 0" class="detail-left">
        <h2>{{ $t('poiDetails.routes.waypoints') }}</h2>
        <PoisDeck
          :pois="points"
          pois-card="PoiCardLight"
          :explorer-mode-enabled="false"
          :favorites-mode-enabled="favoritesModeEnabled"
          @explore-click="$emit('explore-click', $event)"
          @favorite-click="$emit('favorite-click', $event)"
          @zoom-click="$emit('zoom-click', $event)"
        />
      </div>
      <div v-if="pois.length > 0" class="detail-right">
        <h2>{{ $t('poiDetails.routes.pois') }}</h2>
        <PoisDeck
          :pois="pois"
          pois-card="PoiCardLight"
          :explorer-mode-enabled="false"
          :favorites-mode-enabled="favoritesModeEnabled"
          @explore-click="$emit('explore-click', $event)"
          @favorite-click="$emit('favorite-click', $event)"
          @zoom-click="$emit('zoom-click', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import MapPois from '~/components/Map/MapPois.vue'
import PoisDeck from '~/components/PoisCard/PoisDeck.vue'
import {
  ApiPoiDeps,
  ApiRouteWaypoint,
  apiRouteWaypointToApiPoi,
} from '~/lib/apiPoiDeps'
import { ApiPoi, ApiPoiId } from '~/lib/apiPois'

export default defineComponent({
  components: {
    MapPois,
    PoisDeck,
  },

  props: {
    poiId: {
      type: Number as PropType<ApiPoiId>,
      required: true,
    },
    route: {
      type: Object as PropType<ApiPoiDeps>,
      required: true,
    },
    colorFill: {
      type: String as PropType<string>,
      required: true,
    },
    colorLine: {
      type: String as PropType<string>,
      required: true,
    },
    favoritesModeEnabled: {
      type: Boolean,
      required: true,
    },
  },

  data(): {
    routeCollection: ApiPoi[] | null
    points: ApiPoi[]
    pois: ApiPoi[]
  } {
    return {
      routeCollection: null,
      points: [],
      pois: [],
    }
  },

  created() {
    this.routeCollection = this.route.features.map((feature) => {
      if (feature.properties['route:point:type']) {
        const mapPoi = apiRouteWaypointToApiPoi(
          feature as ApiRouteWaypoint,
          this.colorFill,
          this.colorLine
        )
        this.points.push(mapPoi)
        return mapPoi
      } else {
        const featureApi = feature as ApiPoi
        // @ts-ignore
        if (feature.properties.metadata?.id !== this.poiId) {
          this.pois.push(featureApi)
        }
        return featureApi
      }
    })
  },
})
</script>

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

@media (max-width: 991px) {
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
