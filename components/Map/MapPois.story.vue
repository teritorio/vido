<script lang="ts" setup>
import pois from '~/cypress/fixtures/teritorio/references/poi/2/deps.json'
import menu from '~/cypress/fixtures/teritorio/references/menu.json'
import type { ApiPoiUnion } from '~/types/api/poi-deps'
import type { PoiUnion } from '~/types/local/poi-deps'
import type { ApiMenuCategory } from '~/types/api/menu'
import { usePoiDeps } from '~/composables/usePoiDeps'

const { formatPoiDeps, isWaypoint } = usePoiDeps()

const defaultProps = {
  features: (pois.features as ApiPoiUnion[]).map((feature): PoiUnion => {
    const catId = isWaypoint(feature)
      ? pois.features[0].properties.metadata?.category_ids?.[0]
      : feature.properties.metadata?.category_ids?.[0]
    const category = menu.find(item => item.id === (catId || 211)) as ApiMenuCategory
    return formatPoiDeps(feature, category)
  }),
}

const props = {
  Default: {
    ...defaultProps,
  },
}
</script>

<template>
  <Story title="Map/MapPois">
    <Variant
      v-for="(p, name) in props"
      :key="name"
      :title="name.replace(/([A-Z])/g, ' $1').trim()"
    >
      <MapPois v-bind="p" />
    </Variant>
  </Story>
</template>
