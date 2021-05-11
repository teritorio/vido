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
    await this.$store.dispatch('map/fetchConfig', this.$config.API_ENDPOINT)
    await this.$store.dispatch('menu/fetchConfig', this.$config.API_ENDPOINT)
    await this.$store.dispatch('site/fetchConfig', this.$config.API_ENDPOINT)
  },
})
</script>
