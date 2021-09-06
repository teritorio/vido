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
  data() {
    return {
      cssUrl: 'territorio',
    }
  },
  async fetch() {
    await this.$store.dispatch('map/fetchConfig', {
      apiEndpoint: this.$config.API_ENDPOINT,
    })
    await this.$store.dispatch('menu/fetchConfig', {
      apiEndpoint: this.$config.API_ENDPOINT,
    })
    await this.$store.dispatch('site/fetchConfig', {
      apiEndpoint: this.$config.API_ENDPOINT,
    })

    this.cssUrl = await fetch(
      'https://cdt40.carto.guide/api.teritorio/geodata/v1/site'
    )
      .then((res) => res.json())
      .then((json) => {
        return json?.fr?.['teritorio-font']
      })
  },
  // fetchOnServer: false,
  head() {
    return {
      link: [
        {
          rel: 'stylesheet',
          href: this.cssUrl,
        },
      ],
    }
  },
})
</script>
