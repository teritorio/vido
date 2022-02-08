<template>
  <Home :default-bounds="defaultBounds" />
</template>

<script lang="ts">
import type { LngLatBoundsLike } from 'maplibre-gl'
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
    defaultBounds: LngLatBoundsLike | null
  } {
    return {
      cssUrl: 'territorio',
      favicon: '',
      title: '@teritorio/vido',
      defaultBounds: null,
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
        this.defaultBounds = json.bbox_line?.coordinates || [
          [1.43862, 42.41845],
          [1.68279, 42.6775],
        ]
        this.$store.dispatch('site/fetchConfig', { config: json })
        this.$store.dispatch('map/fetchConfig', { config: json })

        // @ts-ignore - Look ok, unable to fix the issue
        this.cssUrl = json?.icon_font_css_url
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
