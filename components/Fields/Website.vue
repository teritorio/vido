<script lang="ts">
import type { PropType } from 'vue'

import { defineNuxtComponent } from '#app'
import ExternalLink from '~/components/UI/ExternalLink.vue'

export default defineNuxtComponent({
  components: {
    ExternalLink,
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
  <ExternalLink :href="url" target="_blank">
    {{ url }}
  </ExternalLink>
</template>
