<template>
  <Index
    v-if="settings && poi"
    :settings="settings"
    :nav-menu-entries="contents"
    :poi="poi"
    :poi-deps="poiDeps"
  />
</template>

<script lang="ts">
import { groupBy } from 'lodash'
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import { mapActions } from 'vuex'

import Index from '~/components/PoisDetails/PoiDetails.vue'
import { ContentEntry, getContents } from '~/lib/apiContent'
import { ApiPoiDeps, getPoiDepsById } from '~/lib/apiPoiDeps'
import { ApiPoi } from '~/lib/apiPois'
import {
  getPropertyTranslations,
  PropertyTranslations,
} from '~/lib/apiPropertyTranslations'
import { getSettings, headerFromSettings, Settings } from '~/lib/apiSettings'
import { vidoConfig } from '~/plugins/vido-config'

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
    poi: ApiPoi | undefined
    poiDeps: ApiPoiDeps | undefined
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
    const poiDepsPromise = getPoiDepsById(
      vidoConfig(req).API_ENDPOINT,
      vidoConfig(req).API_PROJECT,
      vidoConfig(req).API_THEME,
      params.id,
      {
        short_description: false,
      }
    )

    let [settings, contents, propertyTranslations, poiDeps] = await Promise.all(
      [
        getSettingsPromise,
        fetchContents,
        fetchPropertyTranslations,
        poiDepsPromise,
      ]
    )

    let poi: ApiPoi | undefined = undefined
    if (poiDeps) {
      const g = groupBy(
        poiDeps.features,
        (feature) =>
          // @ts-ignore
          feature.properties.metadata?.id == params.id
      )
      poi = g['true'] && (g['true'][0] as ApiPoi)
      poiDeps.features = g['false'] || []
    }

    if (!poi) {
      throw new Error('Missing main route data.')
    }

    return Promise.resolve({
      settings,
      contents,
      propertyTranslations,
      poi,
      poiDeps,
    })
  },

  data(): {
    settings: Settings
    contents: ContentEntry[]
    propertyTranslations: PropertyTranslations
    poi: ApiPoi
    route: ApiPoiDeps | undefined
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
      // @ts-ignore
      route: null,
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
@import '~/assets/details.scss';

body {
  color: $color-text;
  background-color: #fefefe;
  padding: 1rem 1rem;
  min-width: 21rem;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  line-height: 1.3;
  word-wrap: break-word;
  @extend .font-light;
}
</style>
