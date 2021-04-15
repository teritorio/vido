<template>
  <Home />
</template>

<script lang="ts">
import Vue from 'vue'

import Home from '@/components/Home/Home.vue'

export default Vue.extend({
  components: {
    Home,
  },
  fetchOnServer: false,
  async fetch() {
    await this.$store.dispatch('map/fetch', this.$config.API_ORIGIN)
    await this.$store.dispatch('menu/fetch', this.$config.API_ORIGIN)
    await this.$store.dispatch('site/fetch', this.$config.API_ORIGIN)
  },
})
</script>
