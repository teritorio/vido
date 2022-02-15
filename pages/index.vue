<template>
  <Home v-if="settings" :settings="settings" />
</template>

<script lang="ts">
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'

import Home from '@/components/Home/Home.vue'
import { fetchSettings, headerFromSettings } from '@/lib/fetchSettings'
import { Settings } from '@/utils/types'

export default Vue.extend({
  components: {
    Home,
  },

  data(): {
    settings: Settings | null
  } {
    return {
      settings: null,
    }
  },

  async fetch() {
    const menuFetchConfigPromise = this.$store.dispatch('menu/fetchConfig', {
      apiEndpoint: this.$config.API_ENDPOINT,
      apiProject: this.$config.API_PROJECT,
      apiTheme: this.$config.API_THEME,
    })

    const v = await Promise.all([
      fetchSettings(this.$config),
      menuFetchConfigPromise,
    ])
    this.settings = v[0]
  },
  // fetchOnServer: false,

  head(): MetaInfo {
    return headerFromSettings(this.settings)
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
