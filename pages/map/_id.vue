<template>
  <div class="relative flex flex-col w-full h-full">
    <map-poi :poi="poi" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import MapPoi from '@/components/MapPoi.vue'
import { getPoiById } from '@/utils/api'

import { VidoFeature } from '~/utils/types'

export default Vue.extend({
  components: {
    MapPoi,
  },

  validate({ params }) {
    return /^[-_:a-zA-Z0-9]+$/.test(params.id)
  },

  data(): {
    cssUrl: string
    favicon: string
    title: string
    poi: VidoFeature | null
  } {
    return {
      cssUrl: 'territorio',
      favicon: '',
      title: '@teritorio/vido',
      poi: null,
    }
  },

  async fetch() {
    const getPoiPromise = getPoiById(
      this.$config.API_ENDPOINT,
      this.$config.API_PROJECT,
      this.$config.API_THEME,
      this.$route.params.id
    ).then((poi) => {
      this.poi = poi
    })

    const configFetchPromose = fetch(
      `${this.$config.API_ENDPOINT}/${this.$config.API_PROJECT}/${this.$config.API_THEME}`
    )
      .then((res) => res.json())
      .then((json) => {
        this.$store.dispatch('site/fetchConfig', { config: json })
        this.$store.dispatch('map/fetchConfig', { config: json })

        // @ts-ignore - Look ok, unable to fix the issue
        this.cssUrl = json?.icon_font_css_url
        // @ts-ignore - Look ok, unable to fix the issue
        this.favicon_url = json?.favicon_url
        // @ts-ignore - Look ok, unable to fix the issue
        this.title = json?.title
      })

    await Promise.all([getPoiPromise, configFetchPromose])
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

<style>
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>
