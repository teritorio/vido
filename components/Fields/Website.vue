<template>
  <ExternalLink :href="url" target="_blank">{{ url }}</ExternalLink>
</template>

<script lang="ts">
import { PropType } from 'vue'

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
