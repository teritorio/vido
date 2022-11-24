<template>
  <div
    v-if="attribution"
    class="text-2xs md:text-xs p-2 text-right bg-white z-10"
    v-html="attribution"
  ></div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    attribution: {
      type: String,
      default: null,
    },
  },
})
</script>
