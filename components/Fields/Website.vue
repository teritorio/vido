<template>
  <ExternalLink :href="url" target="_blank">{{ url }}</ExternalLink>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import ExternalLink from '~/components/UI/ExternalLink.vue'

export default defineComponent({
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
