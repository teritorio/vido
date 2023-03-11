<template>
  <div
    v-if="attribution"
    class="text-2xs md:text-xs p-2 text-right bg-white z-10"
    v-html="attribution"
  ></div>
</template>

<script lang="ts">
import { PropType } from 'vue'

import { defineNuxtComponent } from '#app'

export default defineNuxtComponent({
  props: {
    attribution: {
      type: String as PropType<string>,
      default: null,
    },
  },
})
</script>
