<template>
  <div class="relative flex flex-col w-full h-full">
    <map-poi :poi="poi" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'

import MapPoi from '@/components/MapPoi.vue'
import { getPoiById } from '@/lib/apiPois'
import { fetchSettings, headerFromSettings } from '@/lib/apiSettings'

import { VidoFeature } from '~/lib/apiPois'
import { Settings } from '~/lib/apiSettings'

export default Vue.extend({
  components: {
    MapPoi,
  },

  validate({ params }) {
    return /^[-_:a-zA-Z0-9]+$/.test(params.id)
  },

  data(): {
    poi: VidoFeature | null
    settings: Settings | null
  } {
    return {
      poi: null,
      settings: null,
    }
  },

  async fetch() {
    const getPoiPromise = getPoiById(
      this.$config.API_ENDPOINT,
      this.$config.API_PROJECT,
      this.$config.API_THEME,
      this.$route.params.id
    )

    const v = await Promise.all([fetchSettings(this.$config), getPoiPromise])
    this.settings = v[0]
    this.poi = v[1]
  },

  // fetchOnServer: false,
  head(): MetaInfo {
    return headerFromSettings(this.settings, {
      title: this.poi?.properties.name,
    })
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
