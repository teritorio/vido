<script lang="ts">
import type { PropType } from 'vue'

import { defineNuxtComponent } from '#app'

export default defineNuxtComponent({
  props: {
    attribution: {
      type: String as PropType<string>,
      default: null,
    },
  },
})
</script>

<template>
  <div
    v-if="attribution"
    class="tw-text-2xs md:tw-text-xs tw-p-2 tw-text-right tw-bg-white tw-z-10"
    v-html="attribution"
  />
</template>
