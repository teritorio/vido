<template>
  <div class="relative flex flex-col w-full h-full">
    <MapPois :pois="pois" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import { mapActions } from 'vuex'

import MapPois from '@/components/MapPois.vue'
import { getPoiByIds } from '@/lib/apiPois'
import { getSettings, headerFromSettings } from '@/lib/apiSettings'

import { ApiPois } from '~/lib/apiPois'
import { Settings } from '~/lib/apiSettings'
import '@/assets/fullmap.css'

export default Vue.extend({
  components: {
    MapPois,
  },

  validate({ params }) {
    return /^[,-_:a-zA-Z0-9]+$/.test(params.ids)
  },

  async asyncData({
    env,
    params,
  }): Promise<{
    pois: ApiPois | null
    settings: Settings | null
  }> {
    if (params.ids) {
      const getSettingsPromise = getSettings(
        env.API_ENDPOINT,
        env.API_PROJECT,
        env.API_THEME
      )

      const ids = params.ids.split(',')
      const getPoiPromise = getPoiByIds(
        env.API_ENDPOINT,
        env.API_PROJECT,
        env.API_THEME,
        ids,
        {
          as_point: false,
        }
      )

      const v = await Promise.all([getSettingsPromise, getPoiPromise])
      const settings = v[0]
      const pois = v[1]
      return Promise.resolve({
        pois,
        settings,
      })
    } else {
      return Promise.resolve({
        pois: null,
        settings: null,
      })
    }
  },

  data(): {
    pois: ApiPois | null
    settings: Settings | null
  } {
    return {
      pois: null,
      settings: null,
    }
  },

  head(): MetaInfo {
    return headerFromSettings(this.settings)
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
