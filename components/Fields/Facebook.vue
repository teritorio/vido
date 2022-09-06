<template>
  <a v-if="url" :href="url" target="_blank">
    <font-awesome-icon icon="fa-brands fa-facebook" color="#4267B2" size="lg" />
  </a>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    url: {
      type: String,
      default: null,
    },
  },
})
</script>
