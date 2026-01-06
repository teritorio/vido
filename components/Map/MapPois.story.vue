<script lang="ts" setup>
import pois from '~/cypress/fixtures/teritorio/references/poi/2/deps.json'
import type { ApiPoi } from '~/types/api/poi'

// ...parametersMap,

const defaultProps = {
  features: pois.features as ApiPoi[],
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
