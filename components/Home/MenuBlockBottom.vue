<script lang="ts">
import type { PropType } from 'vue'

import { defineNuxtComponent } from '#app'

export default defineNuxtComponent({
  props: {
    extraClass: {
      type: String as PropType<string>,
      default: '',
    },
  },
})
</script>

<template>
  <div :class="extraClass">
    <slot />
  </div>
</template>
