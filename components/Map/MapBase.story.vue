<template>
  <Story title="Map/MapBase">
    <Variant
      v-for="(p, name) in props"
      :key="name"
      :title="name.replace(/([A-Z])/g, ' $1').trim()"
    >
      <MapBase v-bind="p" />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import MapBase from '~/components/Map/MapBase.vue'

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
