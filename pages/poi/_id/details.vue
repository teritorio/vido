<template>
  <Index
    v-if="settings && poi"
    :settings="settings"
    :nav-menu-entries="contents"
    :poi="poi"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import { mapActions } from 'vuex'

import { ContentEntry, getContents } from '@/lib/apiContent'
import { getPoiById } from '@/lib/apiPois'
import {
  getPropertyTranslations,
  PropertyTranslations,
} from '@/lib/apiPropertyTranslations'
import { getSettings, headerFromSettings } from '@/lib/apiSettings'
import { vidoConfig } from '@/plugins/vido-config'

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

  async asyncData({ params, req }): Promise<{
    settings: Settings
    contents: ContentEntry[]
    propertyTranslations: PropertyTranslations
    poi: ApiPoi
  }> {
    const getSettingsPromise = getSettings(
      vidoConfig(req).API_ENDPOINT,
      vidoConfig(req).API_PROJECT,
      vidoConfig(req).API_THEME
    )
    const fetchContents = getContents(
      vidoConfig(req).API_ENDPOINT,
      vidoConfig(req).API_PROJECT,
      vidoConfig(req).API_THEME
    )
    const fetchPropertyTranslations = getPropertyTranslations(
      vidoConfig(req).API_ENDPOINT,
      vidoConfig(req).API_PROJECT,
      vidoConfig(req).API_THEME
    )
    const getPoiPromise = getPoiById(
      vidoConfig(req).API_ENDPOINT,
      vidoConfig(req).API_PROJECT,
      vidoConfig(req).API_THEME,
      params.id,
      {
        short_description: false,
      }
    )

    const [settings, contents, propertyTranslations, poi] = await Promise.all([
      getSettingsPromise,
      fetchContents,
      fetchPropertyTranslations,
      getPoiPromise,
    ])

    return Promise.resolve({
      settings,
      contents,
      propertyTranslations,
      poi,
    })
  },

  data(): {
    settings: Settings
    contents: ContentEntry[]
    propertyTranslations: PropertyTranslations
    poi: ApiPoi
  } {
    return {
      // @ts-ignore
      settings: null,
      // @ts-ignore
      contents: null,
      // @ts-ignore
      propertyTranslations: null,
      // @ts-ignore
      poi: null,
    }
  },

  head(): MetaInfo {
    return headerFromSettings(this.settings, {
      title: this.poi?.properties.name,
    })
  },

  created() {
    this.$settings.set(this.settings)
    this.$propertyTranslations.set(this.propertyTranslations)
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
