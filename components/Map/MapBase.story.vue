<template>
  <Story title="Map/MapBase">
    <Variant
      v-for="(p, name) in props"
      :key="name"
      :title="name.replace(/([A-Z])/g, ' $1').trim()"
    >
      <MapBase :style="mapCss" v-bind="p" />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import MapBase from '~/components/Map/MapBase.vue'
import { mapCss } from '~/lib/storybook-types'

const defaultProps = {
  features: [],
}

const props = {
  Default: {
    ...defaultProps,
  },
  OffMapAttrib: {
    ...defaultProps,
    offMapAttribution: true,
  },
}
</script>
