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

<script lang="ts" setup>
import pois from '~/cypress/fixtures/teritorio/references/poi/2/deps.json'

// ...parametersMap,

const defaultProps = {
  features: pois.features,
}

const props = {
  Default: {
    ...defaultProps,
  },
}
</script>
