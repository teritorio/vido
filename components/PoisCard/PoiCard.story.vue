<script lang="ts" setup>
import PoiCard from '~/components/PoisCard/PoiCard.vue'
import poi from '~/cypress/fixtures/teritorio/references/poi/2.json'
import type { ApiPoi } from '~/lib/apiPois'

const defaultProps = {
  poi: poi as ApiPoi,
  favoritesModeEnabled: false,
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
