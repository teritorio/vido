<template>
  <button
    class="flex items-center justify-between w-full px-5 py-3 rounded-lg outline-none focus:outline-none hover:bg-gray-100"
    @click="onClick"
  >
    <div class="flex items-center space-x-4">
      <div
        class="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white rounded-full"
        :style="{ backgroundColor: color, color: textColor }"
      >
        <slot />
      </div>

      <div class="text-left">{{ label }}</div>
    </div>

    <div v-if="!selected" class="flex-shrink-0 text-gray-300">
      <font-awesome-icon
        class="fill-current"
        fixed-width
        :icon="['far', 'circle']"
        size="lg"
      />
    </div>

    <div v-if="selected" class="flex-shrink-0 text-green-500">
      <font-awesome-icon
        class="bg-white rounded-full fill-current"
        fixed-width
        icon="check-circle"
        size="lg"
      />
    </div>
  </button>
</template>

<script lang="ts">
import Vue from 'vue'
import { hex } from 'wcag-contrast'

export default Vue.extend({
  props: {
    color: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    selected: {
      type: Boolean,
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
  methods: {
    onClick() {
      this.$emit('click', this.$props.id)
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
