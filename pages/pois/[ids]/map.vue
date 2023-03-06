<template>
  <div class="relative flex flex-col w-full h-full">
    <MapPois
      :extra-attributions="settings.attributions"
      :features="pois.features"
      :feature-ids="ids"
    />
  </div>
</template>

<script lang="ts">
import { mapWritableState } from 'pinia'
import { defineComponent } from 'vue'
import { MetaInfo } from 'vue-meta'

import { useNuxtApp } from '#app'
import MapPois from '~/components/Map/MapPois.vue'
import { getPois, ApiPois, ApiPoiId } from '~/lib/apiPois'
import { getSettings, headerFromSettings, Settings } from '~/lib/apiSettings'
import { vidoConfig } from '~/plugins/vido-config'
import { siteStore } from '~/stores/site'
import { VidoConfig } from '~/utils/types-config'

export default defineComponent({
  components: {
    MapPois,
  },

  validate({ params }) {
    return /^[,-_:a-zA-Z0-9]+$/.test(params.ids)
  },

  async asyncData({ params, req, $config, $pinia }): Promise<{
    config: VidoConfig
    settings: Settings
    pois: ApiPois | null
  }> {
    const config: VidoConfig =
      siteStore($pinia).config || vidoConfig(req, $config)

    const fetchSettings = siteStore($pinia).settings
      ? Promise.resolve(siteStore($pinia).settings as Settings)
      : getSettings(config.API_ENDPOINT, config.API_PROJECT, config.API_THEME)

    let settings: Settings | null
    let pois: ApiPois | null
    if (params.ids) {
      const ids = params.ids.split(',')
      const getPoiPromise = getPois(
        config.API_ENDPOINT,
        config.API_PROJECT,
        config.API_THEME,
        ids,
        {
          geometry_as: undefined,
        }
      )
      ;[settings, pois] = await Promise.all([fetchSettings, getPoiPromise])
    } else {
      ;[settings] = await Promise.all([fetchSettings])
      pois = null
    }

    return Promise.resolve({
      config,
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

  computed: {
    ...mapWritableState(siteStore, {
      locale: 'locale',
      globalConfig: 'config',
    }),

    ids(): ApiPoiId[] {
      return this.pois.features.map((feature) => feature.properties.metadata.id)
    },
  },

  created() {
    this.globalConfig = this.config!

    const { $settings } = useNuxtApp()
    $settings.set(this.settings)
  },

  beforeMount() {
    const { $trackingInit, $vidoConfigSet } = useNuxtApp()
    $trackingInit(this.config!)
    $vidoConfigSet(this.config!)
  },

  mounted() {
    this.locale = this.$i18n.locale
  },
})
</script>

<style lang="scss">
html {
  @apply h-full w-full box-border overflow-hidden overscroll-none;
}

body,
#__nuxt,
#__layout {
  @apply h-full w-full overflow-hidden overscroll-none;
}

#map-container {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>
