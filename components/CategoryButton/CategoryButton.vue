<template>
  <button
    class="flex flex-col items-center justify-center pt-4 pb-2 leading-none"
  >
    <div
      :class="[
        'relative flex items-center justify-center lg:w-14 lg:h-14 w-12 h-12 mb-2 rounded-full text-white',
        selected ? `bg-${color}-500` : `bg-${color}-300`,
      ]"
    >
      <span
        v-if="badge > 0"
        :class="[
          'absolute top-0 right-0 flex items-center justify-center w-6 h-6 -m-2 text-xs font-bold leading-none text-white rounded-full ring-2 ring-white',
          `bg-${color}-900`,
        ]"
        >{{ badge }}</span
      >
      <slot />
    </div>
    <div class="text-xs">{{ name }}</div>
  </button>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    badge: {
      type: Number,
      required: false,
      default: 0,
    },
    selected: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {},
})
</script>
