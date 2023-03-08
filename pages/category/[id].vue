<template>
  <PoisList
    :settings="settings"
    :nav-menu-entries="contents"
    :initial-category-id="id"
    :initial-pois="pois"
    class="page-index"
  />
</template>

<script lang="ts">
import { mapWritableState } from 'pinia'
import { defineComponent } from 'vue'

import {
  useNuxtApp,
  useRequestHeaders,
  useRuntimeConfig,
  MetaObject,
  useRoute,
} from '#app'
import { definePageMeta } from '#imports'
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

export default defineComponent({
  components: {
    PoisList,
  },

  async setup(): Promise<{
    config: VidoConfig
    settings: Settings
    contents: ContentEntry[]
    propertyTranslations: PropertyTranslations
    id: string
    menuItems: MenuItem[]
    pois: ApiPois
  }> {
    definePageMeta({
      validate({ params }) {
        return (
          typeof params.id === 'string' && /^[,-_:a-zA-Z0-9]+$/.test(params.id)
        )
      },
    })

    const params = useRoute().params
    const config: VidoConfig =
      siteStore().config || vidoConfig(useRequestHeaders(), useRuntimeConfig())

    const fetchSettings = siteStore().settings
      ? Promise.resolve(siteStore().settings as Settings)
      : getSettings(config.API_ENDPOINT, config.API_PROJECT, config.API_THEME)

    const fetchContents = siteStore().contents
      ? Promise.resolve(siteStore().contents as ContentEntry[])
      : getContents(config.API_ENDPOINT, config.API_PROJECT, config.API_THEME)

    const fetchPropertyTranslations = siteStore().translations
      ? Promise.resolve(siteStore().translations as PropertyTranslations)
      : getPropertyTranslations(
          config.API_ENDPOINT,
          config.API_PROJECT,
          config.API_THEME
        )

    const fetchMenuItems =
      menuStore().menuItems !== undefined
        ? Promise.resolve(Object.values(menuStore().menuItems!))
        : getMenu(config.API_ENDPOINT, config.API_PROJECT, config.API_THEME)

    const getPoiByCategoryIdPromise = getPoiByCategoryId(
      config.API_ENDPOINT,
      config.API_PROJECT,
      config.API_THEME,
      params.id as string,
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
      id: params.id as string,
      menuItems,
      pois,
    })
  },

  computed: {
    ...mapWritableState(siteStore, {
      locale: 'locale',
      globalConfig: 'config',
      globalSettings: 'settings',
      globalContents: 'contents',
      globalTranslations: 'translations',
    }),
  },

  head(): MetaObject {
    return headerFromSettings(this.settings)
  },

  created() {
    this.globalConfig = this.config!
    if (this.menuItems) {
      menuStore().fetchConfig(this.menuItems)
    }
    this.globalSettings = this.settings
    this.globalContents = this.contents
    this.globalTranslations = this.propertyTranslations

    const { $settings, $propertyTranslations } = useNuxtApp()
    $settings.set(this.settings)
    $propertyTranslations.set(this.propertyTranslations)
  },

  beforeMount() {
    const { $trackingInit, $vidoConfigSet } = useNuxtApp()
    $trackingInit(this.config!)
    $vidoConfigSet(this.config!)
  },

  mounted() {
    this.locale = this.$i18n.locale
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
