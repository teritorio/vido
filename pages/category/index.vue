<template>
  <PoisList
    :settings="settings"
    :nav-menu-entries="contents"
    :initial-category-id="parseInt($route.params.id)"
    :initial-pois="pois"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import { mapActions } from 'vuex'

import PoisList from '~/components/PoisList/PoisList.vue'
import { ContentEntry, getContents } from '~/lib/apiContent'
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

  async asyncData({ params, req, $config, store }): Promise<{
    config: VidoConfig
    settings: Settings
    propertyTranslations: PropertyTranslations
    pois: ApiPois
  }> {
    const config: VidoConfig =
      store.getters['site/config'] || vidoConfig(req, $config)

    const getSettingsPromise = getSettings(
      config.API_ENDPOINT,
      config.API_PROJECT,
      config.API_THEME
    )
    const fetchContents = getContents(
      config.API_ENDPOINT,
      config.API_PROJECT,
      config.API_THEME
    )
    const fetchPropertyTranslations = getPropertyTranslations(
      config.API_ENDPOINT,
      config.API_PROJECT,
      config.API_THEME
    )
    const fetchMenuItems = getMenu(
      config.API_ENDPOINT,
      config.API_PROJECT,
      config.API_THEME
    )
    const getPoiByCategoryIdPromise = getPoiByCategoryId(
      config.API_ENDPOINT,
      config.API_PROJECT,
      config.API_THEME,
      params.id,
      {
        geometry_as: 'point',
        short_description: true,
      }
    )
    let [settings, contents, propertyTranslations, menuItems, pois] =
      await Promise.all([
        getSettingsPromise,
        fetchContents,
        fetchPropertyTranslations,
        fetchMenuItems,
        getPoiByCategoryIdPromise,
      ])

    return Promise.resolve({
      config,
      settings,
      contents,
      propertyTranslations,
      menuItems,
      pois,
    })
  },

  data(): {
    config: VidoConfig
    settings: Settings
    contents: ContentEntry[]
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
      contents: null,
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
    this.$store.dispatch('menu/fetchConfig', {
      menuItems: this.menuItems,
    })
    this.$settings.set(this.settings)
    this.$propertyTranslations.set(this.propertyTranslations)
  },

  beforeMount() {
    this.$trackingInit(this.config!)
    this.$vidoConfigSet(this.config!)
  },

  mounted() {
    this.$store.dispatch('site/setConfig', this.config!)
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
