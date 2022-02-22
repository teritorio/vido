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
import { getSettings, headerFromSettings } from '@/lib/apiSettings'

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

  async asyncData({
    env,
    params,
  }): Promise<{
    poi: ApiPoi | null
    settings: Settings | null
  }> {
    const getSettingsPromise = getSettings(
      env.API_ENDPOINT,
      env.API_PROJECT,
      env.API_THEME
    )
    const getPoiPromise = getPoiById(
      env.API_ENDPOINT,
      env.API_PROJECT,
      env.API_THEME,
      params.id,
      {
        as_point: false,
      }
    )

    const v = await Promise.all([getSettingsPromise, getPoiPromise])
    return Promise.resolve({
      settings: v[0],
      poi: v[1],
    })
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

  head(): MetaInfo {
    return headerFromSettings(this.settings, {
      title: this.poi?.properties.name,
    })
  },
})
</script>
