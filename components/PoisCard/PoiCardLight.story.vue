<script lang="ts" setup>
import PoiCardLight from '~/components/PoisCard/PoiCardLight.vue'
import poi from '~/cypress/fixtures/teritorio/references/poi/2.json'
import type { ApiPoi } from '~/types/api/poi'

const defaultProps = {
  poi: poi as ApiPoi,
}

const props = {
  Default: {
    ...defaultProps,
  },
}
</script>

<template>
  <Story title="PoisCard/PoiCardLight">
    <Variant
      v-for="(p, name) in props"
      :key="name"
      :title="name.replace(/([A-Z])/g, ' $1').trim()"
    >
      <PoiCardLight v-bind="p" />
    </Variant>
  </Story>
</template>
