<template>
  <Home v-if="siteInfos" :site-infos="siteInfos" />
</template>

<script lang="ts">
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'

import Home from '@/components/Home/Home.vue'
import { SiteInfos } from '@/utils/types'

export default Vue.extend({
  components: {
    Home,
  },

  data(): {
    cssUrl: string
    faviconUrl: string
    title: string
    siteInfos: SiteInfos | null
  } {
    return {
      cssUrl: 'territorio',
      faviconUrl: '',
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

        this.cssUrl = json.icon_font_css_url
        this.faviconUrl = json.favicon_url
        this.title = json.title
      })

    await Promise.all([menuFetchConfigPromise, configFetchPromose])
  },
  // fetchOnServer: false,

  head(): MetaInfo {
    return {
      title: this.title,
      link: [
        {
          rel: 'stylesheet',
          href: this.cssUrl,
        },
        {
          rel: 'icon',
          href: this.faviconUrl,
        },
      ],
    }
  },
})
</script>

<style>
html {
  @apply h-full w-full box-border overflow-hidden overscroll-none;
}

html,
.mapboxgl-map {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  @apply text-gray-900;
}

body,
#__nuxt,
#__layout {
  @apply h-full w-full overflow-hidden overscroll-none;
}

*,
*::before,
*::after {
  @apply m-0 box-border;
}
</style>
