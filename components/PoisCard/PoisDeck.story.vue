<script lang="ts" setup>
import PoisDeck from '~/components/PoisCard/PoisDeck.vue'
import poisDeps from '~/cypress/fixtures/teritorio/references/poi/2/deps.json'
import type { ApiPoiDeps } from '~/types/api/poi-deps'
import { apiRouteWaypointToApiPoi } from '~/lib/apiPoiDeps'

const points = poisDeps.features.filter(
  feature => feature.properties['route:point:type'],
)

const defaultProps = {
  pois: points.map(feature =>
    apiRouteWaypointToApiPoi(
      feature as ApiPoiDeps,
      '#123456',
      '#123456',
      '#FFFFFF',
    ),
  ),
  selectedPoiIds: points.map(feature => feature.properties.id),
  isCardLight: true,
}

const props = {
  Default: {
    ...defaultProps,
  },
  Light: {
    ...defaultProps,
    isCardLight: true,
  },
}
</script>

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
