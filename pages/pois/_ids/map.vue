<template>
  <div class="relative flex flex-col w-full h-full">
    <MapPois :extra-attributions="settings.attributions" :pois="pois" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import { mapActions } from 'vuex'

import MapPois from '~/components/Map/MapPois.vue'
import { getPoiByIds, ApiPois } from '~/lib/apiPois'
import { getSettings, headerFromSettings, Settings } from '~/lib/apiSettings'
import { vidoConfig } from '~/plugins/vido-config'
import { VidoConfig } from '~/utils/types-config'

export default Vue.extend({
  components: {
    MapPois,
  },

  validate({ params }) {
    return /^[,-_:a-zA-Z0-9]+$/.test(params.ids)
  },

  async asyncData({ params, req, $config }): Promise<{
    config: VidoConfig
    settings: Settings
    pois: ApiPois | null
  }> {
    const getSettingsPromise = getSettings(
      vidoConfig(req, $config).API_ENDPOINT,
      vidoConfig(req, $config).API_PROJECT,
      vidoConfig(req, $config).API_THEME
    )

    let settings: Settings | null
    let pois: ApiPois | null
    if (params.ids) {
      const ids = params.ids.split(',')
      const getPoiPromise = getPoiByIds(
        vidoConfig(req, $config).API_ENDPOINT,
        vidoConfig(req, $config).API_PROJECT,
        vidoConfig(req, $config).API_THEME,
        ids,
        {
          geometry_as: undefined,
        }
      )
      ;[settings, pois] = await Promise.all([getSettingsPromise, getPoiPromise])
    } else {
      ;[settings] = await Promise.all([getSettingsPromise])
      pois = null
    }

    return Promise.resolve({
      config: vidoConfig(req, $config),
      settings,
      pois,
    })
  },

  data(): {
    config: VidoConfig | null
    settings: Settings
    pois: ApiPois
  } {
    return {
      config: null,
      // @ts-ignore
      settings: null,
      // @ts-ignore
      poi: null,
    }
  },

  head(): MetaInfo {
    return headerFromSettings(this.settings)
  },

  created() {
    this.$settings.set(this.settings)
  },

  beforeMount() {
    this.$trackingInit(this.config!)
    this.$vidoConfigSet(this.config!)
  },

  mounted() {
    this.setSiteLocale(this.$i18n.locale)
  },

  methods: {
    ...mapActions({
      setSiteLocale: 'site/setLocale',
    }),
  },
})
</script>

<style lang="scss">
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
  @apply text-zinc-900;
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

#map-container {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>
