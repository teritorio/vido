<template>
  <button
    class="flex flex-col items-center justify-center pt-4 pb-2 leading-none"
  >
    <div
      class="relative flex items-center justify-center mb-2 text-white rounded-full w-14 h-14"
      :style="{ backgroundColor: color, color: textColor }"
    >
      <slot />
    </div>
    <div class="text-xs">{{ label }}</div>
  </button>
</template>

<script lang="ts">
import Vue from 'vue'
import { hex } from 'wcag-contrast'

export default Vue.extend({
  props: {
    label: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    selected: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    textColor() {
      const isLightBackgroundColor =
        hex('#333', this.color) > hex('#fff', this.color)

      return isLightBackgroundColor ? '#4d4d4d' : '#fff'
    },
  },
})
</script>

<style>
svg g,
svg path {
  fill: currentColor;
}
</style>
