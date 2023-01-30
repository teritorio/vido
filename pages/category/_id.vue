<template>
  <div>
    <PoisList :fields="fields()" :pois="pois" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import { mapActions } from 'vuex'

import PoisList from '~/components/PoisList/PoisList.vue'
import { getPoiByCategoryId, ApiPois } from '~/lib/apiPois'
import {
  getPropertyTranslations,
  PropertyTranslations,
} from '~/lib/apiPropertyTranslations'
import { getSettings, headerFromSettings, Settings } from '~/lib/apiSettings'
import { vidoConfig } from '~/plugins/vido-config'
import { VidoConfig } from '~/utils/types-config'

export default Vue.extend({
  components: {
    PoisList,
  },

  validate({ params }) {
    return /^[,-_:a-zA-Z0-9]+$/.test(params.id)
  },

  async asyncData({ params, req, $config }): Promise<{
    config: VidoConfig
    settings: Settings
    propertyTranslations: PropertyTranslations
    pois: ApiPois
  }> {
    const getSettingsPromise = getSettings(
      vidoConfig(req, $config).API_ENDPOINT,
      vidoConfig(req, $config).API_PROJECT,
      vidoConfig(req, $config).API_THEME
    )
    const fetchPropertyTranslations = getPropertyTranslations(
      vidoConfig(req, $config).API_ENDPOINT,
      vidoConfig(req, $config).API_PROJECT,
      vidoConfig(req, $config).API_THEME
    )
    const getPoiByCategoryIdPromise = getPoiByCategoryId(
      vidoConfig(req, $config).API_ENDPOINT,
      vidoConfig(req, $config).API_PROJECT,
      vidoConfig(req, $config).API_THEME,
      params.id,
      {
        geometry_as: 'point',
        short_description: true,
      }
    )
    let [settings, propertyTranslations, pois] = await Promise.all([
      getSettingsPromise,
      fetchPropertyTranslations,
      getPoiByCategoryIdPromise,
    ])

    return Promise.resolve({
      config: vidoConfig(req, $config),
      settings,
      propertyTranslations,
      pois,
    })
  },

  data(): {
    config: VidoConfig | null
    settings: Settings
    propertyTranslations: PropertyTranslations
    pois: ApiPois
  } {
    return {
      config: null,
      // @ts-ignore
      settings: null,
      // @ts-ignore
      propertyTranslations: null,
      // @ts-ignore
      pois: null,
    }
  },

  head(): MetaInfo {
    return headerFromSettings(this.settings)
  },

  computed: {},

  created() {
    this.$settings.set(this.settings)
    this.$propertyTranslations.set(this.propertyTranslations)
  },

  beforeMount() {
    this.$trackingInit(this.config!)
    this.$vidoConfigSet(this.config!)
  },

  mounted() {
    this.setSiteLocale(this.$i18n.locale)
  },

  methods: {
    ...mapActions({
      setSiteLocale: 'site/setLocale',
    }),

    fields() {
      return this.pois.features
        ? this.pois.features[0].properties.editorial?.list_fields
        : [{ field: 'name' }]
    },
  },
})
</script>
