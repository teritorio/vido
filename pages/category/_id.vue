<template>
  <div>
    <PoisList
      :category-id="$route.params.id"
      :fields="fields()"
      :pois="pois"
      :url-csv="urlCsv"
      :url-geojson="urlGeojson"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import { mapActions } from 'vuex'

import PoisList from '~/components/PoisList/PoisList.vue'
import {
  getPoiByCategoryId,
  ApiPois,
  getPoiByCategoryIdUrl,
} from '~/lib/apiPois'
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
    config: VidoConfig
    settings: Settings
    propertyTranslations: PropertyTranslations
    pois: ApiPois
  } {
    return {
      // @ts-ignore
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

  computed: {
    urlCsv(): string {
      return this.url('csv')
    },

    urlGeojson(): string {
      return this.url('geojson')
    },
  },

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

    url(format: 'geojson' | 'csv'): string {
      return getPoiByCategoryIdUrl(
        this.config.API_ENDPOINT,
        this.config.API_PROJECT,
        this.config.API_THEME,
        this.$route.params.id,
        {
          geometry_as: 'point',
          short_description: false,
          format: format,
        }
      )
    },
  },
})
</script>
