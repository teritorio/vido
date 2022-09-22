<template>
  <div class="relative flex flex-col w-full h-full">
    <MapPois :extra-attributions="settings.attributions" :pois="pois" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import { mapActions } from 'vuex'

import MapPois from '~/components/MapPois.vue'
import { getPoiByIds, ApiPois } from '~/lib/apiPois'
import { getSettings, headerFromSettings, Settings } from '~/lib/apiSettings'
import { vidoConfig } from '~/plugins/vido-config'

import '~/assets/fullmap.css'

export default Vue.extend({
  components: {
    MapPois,
  },

  validate({ params }) {
    return /^[,-_:a-zA-Z0-9]+$/.test(params.ids)
  },

  async asyncData({ params, req }): Promise<{
    settings: Settings
    pois: ApiPois | null
  }> {
    const getSettingsPromise = getSettings(
      vidoConfig(req).API_ENDPOINT,
      vidoConfig(req).API_PROJECT,
      vidoConfig(req).API_THEME
    )

    let settings: Settings | null
    let pois: ApiPois | null
    if (params.ids) {
      const ids = params.ids.split(',')
      const getPoiPromise = getPoiByIds(
        vidoConfig(req).API_ENDPOINT,
        vidoConfig(req).API_PROJECT,
        vidoConfig(req).API_THEME,
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
      settings,
      pois,
    })
  },

  data(): {
    settings: Settings
    pois: ApiPois
  } {
    return {
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
