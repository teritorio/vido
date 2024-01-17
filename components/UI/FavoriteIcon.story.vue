<script lang="ts" setup>
import FavoriteIcon from '~/components/UI/FavoriteIcon.vue'

const defaultProps = {}

const props = {
  Default: {
    ...defaultProps,
  },
  Active: {
    ...defaultProps,
    isActive: true,
  },
  Colored: {
    ...defaultProps,
    colorLine: '#ff0000',
  },
}
</script>

<template>
  <Story title="UI/FavoriteIcon">
    <Variant
      v-for="(p, name) in props"
      :key="name"
      :title="name.replace(/([A-Z])/g, ' $1').trim()"
    >
      <FavoriteIcon v-bind="p" />
    </Variant>
  </Story>
</template>
