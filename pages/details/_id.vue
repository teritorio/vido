<template>
  <Index v-if="siteInfos && poi" :site-infos="siteInfos" :poi="poi" />
</template>

<script lang="ts">
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'

import { fetchSettings, headerFromSettings } from '@/lib/fetchSettings'
import { getPoiById } from '@/utils/api'

import Index from '~/components/Details/Index.vue'
import { VidoFeature, SiteInfos } from '~/utils/types'

export default Vue.extend({
  components: {
    Index,
  },

  validate({ params }) {
    return /^[-_:a-zA-Z0-9]+$/.test(params.id)
  },

  data(): {
    siteInfos: SiteInfos | null
    poi: VidoFeature | null
  } {
    return {
      poi: null,
      siteInfos: null,
    }
  },

  async fetch() {
    const getPoiPromise = getPoiById(
      this.$config.API_ENDPOINT,
      this.$config.API_PROJECT,
      this.$config.API_THEME,
      this.$route.params.id
    )

    const v = await Promise.all([fetchSettings(this.$config), getPoiPromise])
    this.siteInfos = v[0]
    this.poi = v[1]
  },

  head(): MetaInfo {
    return headerFromSettings(this.siteInfos, {
      title: this.poi?.properties.name,
    })
  },
})
</script>

<style lang="scss">
@import '@/assets/details.scss';

body {
  color: $color-text;
  font-family: $font-ubuntu-light;
  background-color: #fefefe;
  margin: 0;
  padding: 1rem 1rem;
  min-width: 21rem;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  height: 100%;
  max-width: 84rem;
  font-size: 1rem;
  line-height: 1.3;
  word-wrap: break-word;
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
