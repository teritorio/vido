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
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import { mapActions } from 'vuex'

import MapPois from '~/components/Map/MapPois.vue'
import { getPois, ApiPois, ApiPoiId } from '~/lib/apiPois'
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
      const getPoiPromise = getPois(
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

  computed: {
    ids(): ApiPoiId[] {
      return this.pois.features.map((feature) => feature.properties.metadata.id)
    },
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
