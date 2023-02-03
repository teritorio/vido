<template>
  <Embedded :settings="settings" />
</template>

<script lang="ts">
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import { mapActions } from 'vuex'

import Embedded from '~/components/Home/Embedded.vue'
import { ApiMenuItem, getMenu } from '~/lib/apiMenu'
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

  async asyncData({ params, route, req, $config }): Promise<{
    config: VidoConfig
    settings: Settings
    propertyTranslations: PropertyTranslations
    menuItems: ApiMenuItem[]
  }> {
    const fetchSettings = getSettings(
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

    const [settings, propertyTranslations, menuItems] = await Promise.all([
      fetchSettings,
      fetchPropertyTranslations,
      fetchMenuItems,
    ])

    return Promise.resolve({
      config: vidoConfig(req, $config),
      settings,
      propertyTranslations,
      menuItems,
    })
  },

  data(): {
    config: VidoConfig | null
    settings: Settings
    propertyTranslations: PropertyTranslations
    menuItems: ApiMenuItem[]
  } {
    return {
      config: null,
      // @ts-ignore
      settings: null,
      // @ts-ignore
      propertyTranslations: null,
      // @ts-ignore
      menuItems: null,
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
