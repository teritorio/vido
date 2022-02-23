<template>
  <Index v-if="settings && poi" :settings="settings" :poi="poi" />
</template>

<script lang="ts">
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import { mapActions } from 'vuex'

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

  async asyncData({
    env,
    params,
  }): Promise<{
    settings: Settings | null
    poi: ApiPoi | null
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
        short_description: false,
      }
    )

    const v = await Promise.all([getSettingsPromise, getPoiPromise])
    return Promise.resolve({
      settings: v[0],
      poi: v[1],
    })
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

  head(): MetaInfo {
    return headerFromSettings(this.settings, {
      title: this.poi?.properties.name,
    })
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
