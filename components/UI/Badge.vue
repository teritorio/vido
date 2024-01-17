<script lang="ts">
import { defineNuxtComponent } from '#app'

export default defineNuxtComponent({
  props: {
    items: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    hasItems(): boolean {
      return this.items > 0
    },
  },
})
</script>

<template>
  <span
    v-if="hasItems"
    class="tw-flex tw-items-center tw-justify-center tw-text-white tw-text-center tw-rounded-full tw-min-w-5 tw-h-5 tw-border-2 tw-border-white tw-bg-red-600 tw-px-1"
  >
    <span class="tw-text-xs">{{ items }}</span>
  </span>
</template>
