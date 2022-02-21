<template>
  <div class="relative flex flex-col w-full h-full">
    <MapPois :pois="pois" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'

import MapPois from '@/components/MapPois.vue'
import { getPoiByIds } from '@/lib/apiPois'
import { fetchSettings, headerFromSettings } from '@/lib/apiSettings'

import { ApiPois } from '~/lib/apiPois'
import { Settings } from '~/lib/apiSettings'
import '@/assets/fullmap.css'

export default Vue.extend({
  components: {
    MapPois,
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

  async fetch() {
    if (this.$route.query.ids && typeof this.$route.query.ids === 'string') {
      const ids = this.$route.query.ids.split(',')
      const getPoiPromise = getPoiByIds(
        this.$config.API_ENDPOINT,
        this.$config.API_PROJECT,
        this.$config.API_THEME,
        ids,
        {
          as_point: false,
        }
      )

      const v = await Promise.all([fetchSettings(this.$config), getPoiPromise])
      this.settings = v[0]
      this.pois = v[1]
    }
  },

  // fetchOnServer: false,
  head(): MetaInfo {
    return headerFromSettings(this.settings)
  },
})
</script>
