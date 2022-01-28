<template>
  <Home v-if="siteInfos" :site-infos="siteInfos" />
</template>

<script lang="ts">
import Vue from 'vue'

import Home from '@/components/Home/Home.vue'
import { SiteInfos } from '@/utils/types'

export default Vue.extend({
  components: {
    Home,
  },
  data(): {
    cssUrl: string
    favicon: string
    title: string
    siteInfos: SiteInfos | null
  } {
    return {
      cssUrl: 'territorio',
      favicon: '',
      title: '@teritorio/vido',
      siteInfos: null,
    }
  },
  async fetch() {
    const menuFetchConfigPromise = this.$store.dispatch('menu/fetchConfig', {
      apiEndpoint: this.$config.API_ENDPOINT,
      apiProject: this.$config.API_PROJECT,
      apiTheme: this.$config.API_THEME,
    })

    const configFetchPromose = fetch(
      `${this.$config.API_ENDPOINT}/${this.$config.API_PROJECT}/${this.$config.API_THEME}`
    )
      .then((res) => res.json())
      .then((json) => {
        this.siteInfos = Object.assign(
          {
            attribution: [],
            bbox_line: {
              type: 'LineString',
              coordinates: [
                [1.43862, 42.41845],
                [1.68279, 42.6775],
              ],
            },
          },
          json
        )

        // @ts-ignore - Look ok, unable to fix the issue
        this.cssUrl = json.icon_font_css_url
        // @ts-ignore - Look ok, unable to fix the issue
        this.favicon_url = json.favicon_url
        // @ts-ignore - Look ok, unable to fix the issue
        this.title = json.title
      })

    await Promise.all([menuFetchConfigPromise, configFetchPromose])
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
