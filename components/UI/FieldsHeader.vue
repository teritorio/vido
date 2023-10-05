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
import { PropType } from 'vue'

import { defineNuxtComponent } from '#app'

export default defineNuxtComponent({
  props: {
    recursionStack: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
})
</script>
