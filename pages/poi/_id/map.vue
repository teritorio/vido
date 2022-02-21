<template>
  <div class="relative flex flex-col w-full h-full">
    <MapPois :pois="{ features: [poi] }" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'

import MapPois from '@/components/MapPois.vue'
import { getPoiById } from '@/lib/apiPois'
import { fetchSettings, headerFromSettings } from '@/lib/apiSettings'

import { ApiPoi } from '~/lib/apiPois'
import { Settings } from '~/lib/apiSettings'
import '@/assets/fullmap.css'

export default Vue.extend({
  components: {
    MapPois,
  },

  validate({ params }) {
    return /^[-_:a-zA-Z0-9]+$/.test(params.id)
  },

  data(): {
    poi: ApiPoi | null
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
      this.$route.params.id,
      {
        as_point: false,
      }
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
