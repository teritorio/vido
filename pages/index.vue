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
      favicon: '',
      title: '@teritorio/vido',
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

    await fetch(`${this.$config.API_ENDPOINT}/geodata/v1/site`)
      .then((res) => res.json())
      .then((json) => {
        this.cssUrl = json?.fr?.['teritorio-font']
        this.favicon = json?.fr?.site1?.favicon
        this.title = json?.fr?.site1?.title
      })
  },
  // fetchOnServer: false,
  head() {
    return {
      title: this.title,
      link: [
        {
          rel: 'stylesheet',
          href: this.cssUrl,
        },
        {
          rel: 'icon',
          href: this.favicon,
        },
      ],
    }
  },
})
</script>
