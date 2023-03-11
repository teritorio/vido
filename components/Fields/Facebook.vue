<template>
  <a v-if="url" :href="url" target="_blank">
    <font-awesome-icon icon="fa-brands fa-facebook" size="lg" />
  </a>
</template>

<script lang="ts">
import { PropType } from 'vue'

import { defineNuxtComponent } from '#app'

export default defineNuxtComponent({
  props: {
    url: {
      type: String as PropType<string>,
      default: null,
    },
  },
})
</script>
