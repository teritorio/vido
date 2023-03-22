<template>
  <Story title="Map/Map">
    <Variant
      v-for="(p, name) in props"
      :key="name"
      :title="name.replace(/([A-Z])/g, ' $1').trim()"
    >
      <Map :style="mapCss" v-bind="p" />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import Map from '~/components/Map/Map.vue'
import { mapCss } from '~/lib/storybook-types'

// ...parametersMap,

const defaultProps = {}

const props = {
  Default: {
    ...defaultProps,
  },
  FullScreen: {
    ...defaultProps,
    fullscreenControl: true,
  },
}
</script>
