<template>
  <button
    class="flex flex-col items-center justify-center pt-4 pb-2 leading-none"
  >
    <div
      :class="[
        'relative flex items-center justify-center lg:w-14 lg:h-14 w-12 h-12 mb-2 rounded-full text-white ',
        color === 'red' && selected && `bg-red-500`,
        color === 'red' && !selected && `bg-red-300`,
        color === 'green' && selected && `bg-green-500`,
        color === 'green' && !selected && `bg-green-300`,
        color === 'blue' && selected && `bg-blue-500`,
        color === 'blue' && !selected && `bg-blue-300`,
        color === 'yellow' && selected && `bg-yellow-500`,
        color === 'yellow' && !selected && `bg-yellow-300`,
        color === 'indigo' && selected && `bg-indigo-500`,
        color === 'indigo' && !selected && `bg-indigo-300`,
        color === 'purple' && selected && `bg-purple-500`,
        color === 'purple' && !selected && `bg-purple-300`,
        color === 'pink' && selected && `bg-pink-500`,
        color === 'pink' && !selected && `bg-pink-300`,
      ]"
    >
      <span
        v-if="badge > 0"
        :class="[
          'absolute top-0 right-0 flex items-center justify-center w-6 h-6 -m-2 text-xs font-bold leading-none fill-current text-white rounded-full ring-2 ring-white',
          color === 'red' && `bg-red-900`,
          color === 'green' && `bg-green-900`,
          color === 'blue' && `bg-blue-900`,
          color === 'yellow' && `bg-yellow-900`,
          color === 'indigo' && `bg-indigo-900`,
          color === 'purple' && `bg-purple-900`,
          color === 'pink' && `bg-pink-900`,
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
