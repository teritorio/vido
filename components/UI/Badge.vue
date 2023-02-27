<template>
  <span
    v-if="hasItems"
    class="flex items-center justify-center text-white text-center rounded-full min-w-5 h-5 border-2 border-white bg-red-600 px-1"
  >
    <span class="text-xs">{{ items }}</span>
  </span>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
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
