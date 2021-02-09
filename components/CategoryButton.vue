<template>
  <button
    class="flex flex-col flex-wrap items-center justify-center leading-none"
  >
    <div
      :class="`relative flex items-center justify-center w-12 h-12 mb-1 rounded-full border-2 ${bgClass} ${textClass} ${borderClass} `"
    >
      <span
        v-if="badge > 0"
        :class="`absolute top-0 right-0 flex items-center justify-center w-6 h-6 -m-2 text-xs font-bold leading-none text-white bg-${color}-900 rounded-full border-2 border-white`"
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
  data(): any {
    const bgClass = this.selected ? `bg-${this.color}-200` : `bg-gray-100`
    const borderClass = this.selected
      ? `border-${this.color}-500`
      : `border-gray-300`

    const textClassIntenisty = this.selected ? '700' : '500'
    const textClass = `text-${this.color}-${textClassIntenisty}`

    return {
      bgClass,
      textClass,
      borderClass,
    }
  },
  methods: {},
})
</script>
