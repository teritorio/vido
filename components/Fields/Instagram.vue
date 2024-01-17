<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { PropType } from 'vue'

import { defineNuxtComponent } from '#app'

export default defineNuxtComponent({
  components: {
    FontAwesomeIcon,
  },

  props: {
    url: {
      type: String as PropType<string>,
      default: null,
    },
  },
})
</script>

<template>
  <a v-if="url" :href="url" target="_blank">
    <FontAwesomeIcon icon="fa-brands fa-instagram" size="lg" />
  </a>
</template>
