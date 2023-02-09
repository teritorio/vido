<template>
  <Embedded
    :settings="settings"
    :initial-category-ids="categoryIds"
    :initial-poi="initialPoi"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import { mapActions } from 'vuex'

import Embedded from '~/components/Home/Embedded.vue'
import { ApiMenuItem, getMenu } from '~/lib/apiMenu'
import { getPoiById, ApiPoi } from '~/lib/apiPois'
import {
  getPropertyTranslations,
  PropertyTranslations,
} from '~/lib/apiPropertyTranslations'
import { getSettings, headerFromSettings, Settings } from '~/lib/apiSettings'
import { vidoConfig } from '~/plugins/vido-config'
import { VidoConfig } from '~/utils/types-config'

export default Vue.extend({
  components: {
    Embedded,
  },

  async asyncData({ params, route, req, $config, store }): Promise<{
    config: VidoConfig
    settings: Settings
    propertyTranslations: PropertyTranslations
    menuItems: ApiMenuItem[] | undefined
    categoryIds: number[] | null
    initialPoi: ApiPoi | null
  }> {
    const config: VidoConfig =
      store.getters['site/config'] || vidoConfig(req, $config)

    const fetchSettings = store.getters['site/settings']
      ? Promise.resolve(store.getters['site/settings'] as Settings)
      : getSettings(config.API_ENDPOINT, config.API_PROJECT, config.API_THEME)

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
    menuItems: ApiMenuItem[]
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
      this.$store.dispatch('menu/fetchConfig', {
        menuItems: this.menuItems,
      })
    }
    this.$store.dispatch('site/setConfig', this.config!)

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

<style>
body,
#__nuxt,
#__layout {
  @apply h-full w-full overflow-hidden overscroll-none;
}
</style>
