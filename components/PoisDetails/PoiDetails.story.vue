<script lang="ts" setup>
import PoiDetails from '~/components/PoisDetails/PoiDetails.vue'
import poisDeps from '~/cypress/fixtures/teritorio/references/poi/1/deps.json'
import menu from '~/cypress/fixtures/teritorio/references/menu.json'
import settings from '~/cypress/fixtures/teritorio/references/settings.json'
import type { ApiPoiUnion } from '~/types/api/poi-deps'
import type { MenuCategory } from '~/types/local/menu'
import type { Settings } from '~/lib/apiSettings'
import { usePoiDeps } from '~/composables/usePoiDeps'

const { formatPoiDeps, isWaypoint } = usePoiDeps()
const feature = poisDeps.features[0] as ApiPoiUnion
const catId = isWaypoint(feature)
  ? poisDeps.features[1]?.properties.metadata?.category_ids?.[0]
  : feature.properties.metadata?.category_ids?.[0]
const category = menu.find(item => item.id === (catId || 22)) as MenuCategory

const defaultProps = {
  settings: settings as Settings,
  poi: formatPoiDeps(feature, category),
}

const { featureSeoTitle } = useFeature(toRef(defaultProps.poi), { type: 'details' })

const props = {
  Default: {
    ...defaultProps,
    pageTitle: featureSeoTitle.value || '',
  },
}
</script>

<template>
  <Story title="PoisDetails/PoiDetails">
    <Variant
      v-for="(p, name) in props"
      :key="name"
      :title="name.replace(/([A-Z])/g, ' $1').trim()"
    >
      <PoiDetails v-bind="p" />
    </Variant>
  </Story>
</template>
