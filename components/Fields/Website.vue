<template>
  <ExternalLink :href="url" target="_blank">{{ url }}</ExternalLink>
</template>

<script lang="ts">
import Vue from 'vue'

import ExternalLink from '~/components/UI/ExternalLink.vue'

export default Vue.extend({
  components: {
    ExternalLink,
  },
  props: {
    url: {
      type: String,
      default: null,
    },
  },
})
</script>
