<template>
  <div>
    <PoisList
      :menu-items="menuItems"
      :initial-category-id="parseInt($route.params.id)"
      :initial-pois="pois"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import { mapActions } from 'vuex'

import PoisList from '~/components/PoisList/PoisList.vue'
import { ApiMenuItem, getMenu } from '~/lib/apiMenu'
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
    const fetchMenuItems = getMenu(
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
    let [settings, propertyTranslations, menuItems, pois] = await Promise.all([
      getSettingsPromise,
      fetchPropertyTranslations,
      fetchMenuItems,
      getPoiByCategoryIdPromise,
    ])

    return Promise.resolve({
      config: vidoConfig(req, $config),
      settings,
      propertyTranslations,
      menuItems,
      pois,
    })
  },

  data(): {
    config: VidoConfig
    settings: Settings
    propertyTranslations: PropertyTranslations
    menuItems: ApiMenuItem[]
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
      menuItems: null,
      // @ts-ignore
      pois: null,
    }
  },

  head(): MetaInfo {
    return headerFromSettings(this.settings)
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
  },
})
</script>
