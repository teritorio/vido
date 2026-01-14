<script lang="ts" setup>
import PoisTable from '~/components/PoisList/PoisTable.vue'
import poisDeps from '~/cypress/fixtures/teritorio/references/poi/1/deps.json'
import type { ApiMenuCategory } from '~/types/api/menu'
import type { ApiPoiCollection } from '~/types/api/poi'
import type { ApiPoiUnion } from '~/types/api/poi-deps'
import menu from '~/cypress/fixtures/teritorio/references/menu.json'

const { formatPoiDeps } = usePoiDeps()
const category = menu.find(item => item.id === 211) as ApiMenuCategory
const poi = formatPoiDeps(poisDeps.features[0] as ApiPoiUnion, category)

const defaultProps = {
  fields: poi.properties.editorial.list_fields,
  pois: poisDeps as ApiPoiCollection,
}

const props = {
  Default: {
    ...defaultProps,
  },
}
</script>

<template>
  <Story title="PoisList/PoisTable">
    <Variant
      v-for="(p, name) in props"
      :key="name"
      :title="name.replace(/([A-Z])/g, ' $1').trim()"
    >
      <PoisTable v-bind="p" />
    </Variant>
  </Story>
</template>
