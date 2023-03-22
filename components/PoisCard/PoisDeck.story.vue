<template>
  <Story title="PoisCard/PoisDeck">
    <Variant
      v-for="(p, name) in props"
      :key="name"
      :title="name.replace(/([A-Z])/g, ' $1').trim()"
    >
      <PoisDeck v-bind="p" />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import PoisDeck from '~/components/PoisCard/PoisDeck.vue'
import poisDeps from '~/cypress/fixtures/teritorio/references/poi/2/deps.json'
import { ApiRouteWaypoint, apiRouteWaypointToApiPoi } from '~/lib/apiPoiDeps'
import { ApiPoiId } from '~/lib/apiPois'

const points = poisDeps['features'].filter(
  (feature) => feature.properties['route:point:type']
)

const defaultProps = {
  pois: points.map((feature) =>
    apiRouteWaypointToApiPoi(
      feature as unknown as ApiRouteWaypoint,
      '#123456',
      '#123456'
    )
  ),
  selectedPoiIds: points.map((feature) => feature.properties.id as ApiPoiId),
  explorerModeEnabled: false,
  favoritesModeEnabled: false,
}

const props = {
  Default: {
    ...defaultProps,
  },
  Light: {
    ...defaultProps,
    poisCard: 'PoiCardLight' as 'PoiCard' | 'PoiCardLight' | undefined,
  },
}
</script>
