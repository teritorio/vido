<template>
  <button
    class="flex flex-col flex-wrap items-center justify-center leading-none"
  >
    <div
      :class="`flex items-center justify-center w-12 h-12 mb-1 bg-${color}-100 rounded-full text-${color}-500`"
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
      default: 'green',
    },
  },
  data() {
    return {
      map: null,
    }
  },
  methods: {},
})
</script>
