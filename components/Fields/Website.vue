<template>
  <ExternalLink :href="url" target="_blank">{{ url }}</ExternalLink>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import ExternalLink from '~/components/UI/ExternalLink.vue'

export default Vue.extend({
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
