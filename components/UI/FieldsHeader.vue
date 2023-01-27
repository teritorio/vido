<template>
  <h2 v-if="recursionStack && recursionStack.length === 0">
    <slot />
  </h2>
  <h3 v-else-if="recursionStack && recursionStack.length === 1">
    <slot />
  </h3>
  <span v-else><slot />{{ $tc('ponctuation.colon') }}</span>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  props: {
    recursionStack: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
})
</script>
