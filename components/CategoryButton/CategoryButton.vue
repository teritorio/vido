<template>
  <button
    :class="[
      'flex focus:outline-none outline-none flex-col items-center self-stretch justify-start pt-4 pb-2 leading-none transition-colors rounded-lg p-4',
      !selected && 'hover:bg-gray-100',
      selected && 'selected bg-gray-100 hover:bg-transparent',
    ]"
    @click="onClick"
  >
    <div
      class="relative flex items-center justify-center mb-2 text-white rounded-full w-14 h-14"
      :style="{ backgroundColor: color, color: textColor }"
    >
      <slot />

      <div
        v-if="selected"
        class="absolute right-0 text-lg text-green-500 -top-1.5"
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
    </div>

    <div class="text-sm">{{ label }}</div>
  </button>
</template>

<script lang="ts">
import Vue from 'vue'

import { getContrastedTextColor } from '@/utils/picto'

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
      return getContrastedTextColor(this.color)
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
