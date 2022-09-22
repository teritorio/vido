<template>
  <h2 v-if="recursionLevel === 0">
    <slot />
  </h2>
  <span v-else><slot /></span>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    recursionLevel: {
      type: Number,
      default: 0,
    },
  },
})
</script>
