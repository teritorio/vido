<script lang="ts">
import type { PropType } from 'vue'

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

<template>
  <h2 v-if="recursionStack && recursionStack.length === 0">
    <slot />
  </h2>
  <h3 v-else-if="recursionStack && recursionStack.length === 1">
    <slot />
  </h3>
  <span v-else><slot />{{ $t('ponctuation.colon') }}</span>
</template>
