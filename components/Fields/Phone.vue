<template>
  <ExternalLink
    v-if="$screen.phone"
    :href="`tel:${number}`"
    :title="$tc('fields.phone.callNumber')"
  >
    {{ number }}
  </ExternalLink>
  <span v-else>
    {{ number }}
  </span>
</template>

<script lang="ts">
import Vue from 'vue'

import ExternalLink from '~/components/UI/ExternalLink.vue'

export default Vue.extend({
  components: {
    ExternalLink,
  },

  props: {
    number: {
      type: String,
      default: null,
    },
  },
})
</script>
