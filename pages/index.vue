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
  data(): {
    cssUrl: string
    favicon: string
    title: string
  } {
    return {
      cssUrl: 'territorio',
      favicon: '',
      title: '@teritorio/vido',
    }
  },
  async fetch() {
    await this.$store.dispatch('menu/fetchConfig', {
      apiEndpoint: this.$config.API_ENDPOINT,
      apiProject: this.$config.API_PROJECT,
      apiTheme: this.$config.API_THEME,
    })

    await fetch(
      `${this.$config.API_ENDPOINT}/${this.$config.API_PROJECT}/${this.$config.API_THEME}`
    )
      .then((res) => res.json())
      .then((json) => {
        this.$store.dispatch('site/fetchConfig', { config: json })
        this.$store.dispatch('map/fetchConfig', { config: json })

        // @ts-ignore - Look ok, unable to fix the issue
        this.cssUrl = json?.teritorio_font_css_url
        // @ts-ignore - Look ok, unable to fix the issue
        this.favicon_url = json?.favicon_url
        // @ts-ignore - Look ok, unable to fix the issue
        this.title = json?.title
      })
  },
  // fetchOnServer: false,
  head() {
    return {
      // @ts-ignore - Look ok, unable to fix the issue
      title: this.title,
      link: [
        {
          rel: 'stylesheet',
          // @ts-ignore - Look ok, unable to fix the issue
          href: this.cssUrl,
        },
        {
          rel: 'icon',
          // @ts-ignore - Look ok, unable to fix the issue
          href: this.favicon,
        },
      ],
    }
  },
})
</script>
