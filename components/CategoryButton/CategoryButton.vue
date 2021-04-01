<template>
  <button
    :class="[
      'relative flex focus:outline-none outline-none flex-col items-center self-stretch justify-start pt-4 pb-2 leading-none transition-colors rounded-lg p-4',
      !selected && 'hover:bg-gray-100',
      selected && 'selected bg-gray-100 hover:bg-transparent',
    ]"
  >
    <div
      class="relative flex items-center justify-center mb-2 text-white rounded-full w-14 h-14"
      :style="{ backgroundColor: color, color: textColor }"
    >
      <slot />
    </div>

    <div class="text-sm">{{ label }}</div>

    <div
      v-if="selected"
      class="absolute text-lg text-green-500 top-2.5 right-7"
    >
      <font-awesome-icon
        icon="check-circle"
        :class="[
          'rounded-full bg-white fill-current ring-4 transition-colors',
          !selected && ' ring-white',
          selected && 'ring-gray-100',
        ]"
      />
    </div>
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

<style scoped>
svg g,
svg path {
  fill: currentColor;
}

button:not(.selected):hover svg[data-icon='check-circle'] {
  @apply ring-gray-100;
}

button.selected:hover svg[data-icon='check-circle'] {
  @apply ring-white;
}
</style>
