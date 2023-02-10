<template>
  <PoisList
    :settings="settings"
    :nav-menu-entries="contents"
    :initial-category-id="parseInt($route.params.id)"
    :initial-pois="pois"
    class="page-index"
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

    const fetchSettings = store.getters['site/settings']
      ? Promise.resolve(store.getters['site/settings'] as Settings)
      : getSettings(config.API_ENDPOINT, config.API_PROJECT, config.API_THEME)

    const fetchContents = store.getters['site/content']
      ? Promise.resolve(store.getters['site/content'] as ContentEntry[])
      : getContents(config.API_ENDPOINT, config.API_PROJECT, config.API_THEME)

    const fetchPropertyTranslations = store.getters['site/translations']
      ? Promise.resolve(
          store.getters['site/translations'] as PropertyTranslations
        )
      : getPropertyTranslations(
          config.API_ENDPOINT,
          config.API_PROJECT,
          config.API_THEME
        )

    const fetchMenuItems = store.getters['menu/menuItems']
      ? Promise.resolve([store.getters['menu/menuItems']])
      : getMenu(config.API_ENDPOINT, config.API_PROJECT, config.API_THEME)

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
        fetchSettings,
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
    this.$store.dispatch('site/setConfig', this.config!)
    if (this.menuItems) {
      this.$store.dispatch('menu/fetchConfig', {
        menuItems: this.menuItems,
      })
    }
    this.$store.dispatch('site/setSettings', this.settings)
    this.$store.dispatch('site/setContents', this.contents)
    this.$store.dispatch('site/setTranslations', this.propertyTranslations)

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

<style lang="scss">
@import '~/assets/details.scss';

.page-index {
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
