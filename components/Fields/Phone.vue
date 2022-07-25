<template>
  <a
    v-if="$screen.phone"
    :href="`tel:${number}`"
    :title="$tc('toast.callNumber')"
  >
    {{ number }}
  </a>
  <span v-else>
    {{ number }}
  </span>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    number: {
      type: String,
      default: null,
    },
  },
})
</script>
