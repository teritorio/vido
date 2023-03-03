<template>
  <h2 v-if="recursionStack && recursionStack.length === 0">
    <slot></slot>
  </h2>
  <h3 v-else-if="recursionStack && recursionStack.length === 1">
    <slot></slot>
  </h3>
  <span v-else><slot></slot>{{ $t('ponctuation.colon') }}</span>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    recursionStack: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
})
</script>
