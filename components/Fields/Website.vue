<template>
  <a v-if="url" :href="url" target="_blank">
    {{ url }}
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

<style scoped>
a {
  text-decoration: underline;
}
</style>
