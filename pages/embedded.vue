<template>
  <Embedded
    :settings="settings"
    :initial-category-ids="categoryIds"
    :initial-poi="initialPoi"
  />
</template>

<script lang="ts">
import { mapActions } from 'pinia'
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'

import Embedded from '~/components/Home/Embedded.vue'
import { getMenu, MenuItem } from '~/lib/apiMenu'
import { getPoiById, ApiPoi } from '~/lib/apiPois'
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
    Embedded,
  },

  async asyncData({ params, route, req, $config, $pinia }): Promise<{
    config: VidoConfig
    settings: Settings
    propertyTranslations: PropertyTranslations
    menuItems: MenuItem[] | undefined
    categoryIds: number[] | null
    initialPoi: ApiPoi | null
  }> {
    const config: VidoConfig =
      siteStore($pinia).config || vidoConfig(req, $config)

    const fetchSettings = siteStore($pinia).settings
      ? Promise.resolve(siteStore($pinia).settings as Settings)
      : getSettings(config.API_ENDPOINT, config.API_PROJECT, config.API_THEME)

    const fetchPropertyTranslations = siteStore($pinia).translations
      ? Promise.resolve(siteStore($pinia).translations as PropertyTranslations)
      : getPropertyTranslations(
          config.API_ENDPOINT,
          config.API_PROJECT,
          config.API_THEME
        )

    const fetchMenuItems = menuStore($pinia).menuItems
      ? Promise.resolve(undefined)
      : getMenu(config.API_ENDPOINT, config.API_PROJECT, config.API_THEME)

    let categoryIdsJoin: string | null
    let poiId: string | null
    // Workaround Nuxt missing feature to simple respect trialling slash meaning
    if (params.poiId) {
      categoryIdsJoin = params.p1
      poiId = params.poiId
    } else if (route.path.endsWith('/')) {
      categoryIdsJoin = params.p1
      poiId = null
    } else {
      categoryIdsJoin = null
      poiId = params.p1
    }

    const categoryIds =
      (categoryIdsJoin &&
        categoryIdsJoin.split(',').map((id) => parseInt(id))) ||
      null
    let fetchPoi: Promise<ApiPoi | null> = Promise.resolve(null)
    if (poiId) {
      fetchPoi = getPoiById(
        config.API_ENDPOINT,
        config.API_PROJECT,
        config.API_THEME,
        poiId
      )
    }

    const [settings, propertyTranslations, menuItems, initialPoi] =
      await Promise.all([
        fetchSettings,
        fetchPropertyTranslations,
        fetchMenuItems,
        fetchPoi,
      ])

    return Promise.resolve({
      config,
      settings,
      propertyTranslations,
      menuItems,
      categoryIds,
      initialPoi,
    })
  },

  data(): {
    config: VidoConfig | null
    settings: Settings
    propertyTranslations: PropertyTranslations
    menuItems: MenuItem[]
    categoryIds: number[] | null
    initialPoi: ApiPoi | null
  } {
    return {
      config: null,
      // @ts-ignore
      settings: null,
      // @ts-ignore
      propertyTranslations: null,
      // @ts-ignore
      menuItems: null,
      categoryIds: null,
      initialPoi: null,
    }
  },

  head(): MetaInfo {
    return headerFromSettings(this.settings)
  },

  created() {
    if (this.menuItems) {
      menuStore().fetchConfig(this.menuItems)
    }
    siteStore().setConfig(this.config!)

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

<style scoped>
body,
#__nuxt,
#__layout {
  @apply h-full w-full overflow-hidden overscroll-none;
}
</style>
