<script lang="ts" setup>
import PoisDeck from '~/components/PoisCard/PoisDeck.vue'
import poisDeps from '~/cypress/fixtures/teritorio/references/poi/2/deps.json'
import menu from '~/cypress/fixtures/teritorio/references/menu.json'
import type { ApiPoiUnion } from '~/types/api/poi-deps'
import type { ApiMenuCategory } from '~/types/api/menu'
import { usePoiDeps } from '~/composables/usePoiDeps'

const { formatPoiDeps, isWaypoint } = usePoiDeps()
const points = (poisDeps.features as ApiPoiUnion[]).filter(
  feature => isWaypoint(feature),
)

const category = menu.find(item => item.id === 211) as ApiMenuCategory

const defaultProps = {
  pois: points.map(feature =>
    formatPoiDeps(feature, category),
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
