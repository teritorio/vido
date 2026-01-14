<script lang="ts" setup>
import PoiCard from '~/components/PoisCard/PoiCard.vue'
import poi from '~/cypress/fixtures/teritorio/references/poi/2.json'
import menu from '~/cypress/fixtures/teritorio/references/menu.json'
import type { ApiPoi } from '~/types/api/poi'
import type { ApiMenuCategory } from '~/types/api/menu'
import { usePoi } from '~/composables/usePoi'

const { formatPoi } = usePoi()
const category = menu.find(item => item.id === 211) as ApiMenuCategory

const defaultProps = {
  poi: formatPoi(poi as ApiPoi, category),
}

const props = {
  Default: {
    ...defaultProps,
  },
}
</script>

<template>
  <Story title="PoisCard/PoiCard">
    <Variant
      v-for="(p, name) in props"
      :key="name"
      :title="name.replace(/([A-Z])/g, ' $1').trim()"
    >
      <PoiCard v-bind="p" />
    </Variant>
  </Story>
</template>
