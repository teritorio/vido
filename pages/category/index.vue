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
import { mapActions } from 'pinia'
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'

import PoisList from '~/components/PoisList/PoisList.vue'
import { ContentEntry, getContents } from '~/lib/apiContent'
import { MenuItem, getMenu } from '~/lib/apiMenu'
import { getPoiByCategoryId, ApiPois } from '~/lib/apiPois'
import {
  getPropertyTranslations,
  PropertyTranslations,
} from '~/lib/apiPropertyTranslations'
import { getSettings, headerFromSettings, Settings } from '~/lib/apiSettings'
import { vidoConfig } from '~/plugins/vido-config'
import { menuStore } from '~/stores/menu'
import { siteStore } from '~/stores/site'
import { VidoConfig } from '~/utils/types-config'

export default Vue.extend({
  components: {
    PoisList,
  },

  async asyncData({ params, req, $config, $pinia }): Promise<{
    config: VidoConfig
    settings: Settings
    propertyTranslations: PropertyTranslations
    pois: ApiPois
  }> {
    const config: VidoConfig =
      siteStore($pinia).config || vidoConfig(req, $config)

    const fetchSettings = siteStore($pinia).settings
      ? Promise.resolve(siteStore($pinia).settings as Settings)
      : getSettings(config.API_ENDPOINT, config.API_PROJECT, config.API_THEME)

    const fetchContents = siteStore($pinia).contents
      ? Promise.resolve(siteStore($pinia).contents as ContentEntry[])
      : getContents(config.API_ENDPOINT, config.API_PROJECT, config.API_THEME)

    const fetchPropertyTranslations = siteStore($pinia).translations
      ? Promise.resolve(siteStore($pinia).translations as PropertyTranslations)
      : getPropertyTranslations(
          config.API_ENDPOINT,
          config.API_PROJECT,
          config.API_THEME
        )

    const fetchMenuItems = menuStore($pinia).menuItems
      ? Promise.resolve(menuStore($pinia).menuItems)
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
    menuItems: MenuItem[]
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
    siteStore().setConfig(this.config!)
    if (this.menuItems) {
      menuStore().fetchConfig(this.menuItems)
    }
    siteStore().setSettings(this.settings)
    siteStore().setContents(this.contents)
    siteStore().setTranslations(this.propertyTranslations)

    this.$settings.set(this.settings)
    this.$propertyTranslations.set(this.propertyTranslations)
  },

  beforeMount() {
    this.$trackingInit(this.config!)
    this.$vidoConfigSet(this.config!)
  },

  mounted() {
    this.setLocale(this.$i18n.locale)
  },

  methods: {
    ...mapActions(siteStore, ['setLocale']),
  },
})
</script>

<style lang="scss" scoped>
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
