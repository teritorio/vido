<template>
  <Index v-if="settings && poi" :settings="settings" :poi="poi" />
</template>

<script lang="ts">
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'

import { getPoiById } from '@/lib/apiPois'
import { getSettings, headerFromSettings } from '@/lib/apiSettings'

import Index from '~/components/Details/Index.vue'
import { ApiPoi } from '~/lib/apiPois'
import { Settings } from '~/lib/apiSettings'

export default Vue.extend({
  components: {
    Index,
  },

  validate({ params }) {
    return /^[-_:a-zA-Z0-9]+$/.test(params.id)
  },

  data(): {
    settings: Settings | null
    poi: ApiPoi | null
  } {
    return {
      poi: null,
      settings: null,
    }
  },

  async fetch() {
    const getSettingsPromise = getSettings(
      this.$config.API_ENDPOINT,
      this.$config.API_PROJECT,
      this.$config.API_THEME
    )
    const getPoiPromise = getPoiById(
      this.$config.API_ENDPOINT,
      this.$config.API_PROJECT,
      this.$config.API_THEME,
      this.$route.params.id,
      {
        short_description: false,
      }
    )

    const v = await Promise.all([getSettingsPromise, getPoiPromise])
    this.settings = v[0]
    this.poi = v[1]
  },

  head(): MetaInfo {
    return headerFromSettings(this.settings, {
      title: this.poi?.properties.name,
    })
  },
})
</script>

<style lang="scss">
@import '@/assets/details.scss';

body {
  color: $color-text;
  background-color: #fefefe;
  padding: 1rem 1rem;
  min-width: 21rem;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  line-height: 1.3;
  word-wrap: break-word;
  @extend .font-ubuntu-light;
}

a {
  color: $color-text;
  text-decoration: none;

  &:hover,
  &:visited {
    color: $color-text;
  }
}
</style>
