<template>
  <PoisList
    :settings="settings"
    :nav-menu-entries="contents"
    :initial-category-id="parseInt(id)"
    :initial-pois="pois"
    class="page-index"
  />
</template>

<script lang="ts">
import { mapWritableState } from 'pinia'
import { Ref } from 'vue'

import {
  useRequestHeaders,
  useRuntimeConfig,
  useRoute,
  useHead,
  defineNuxtComponent,
} from '#app'
import { definePageMeta, useAsyncData } from '#imports'
import PoisList from '~/components/PoisList/PoisList.vue'
import { ContentEntry, getContents } from '~/lib/apiContent'
import { MenuItem, getMenu } from '~/lib/apiMenu'
import { getPoiByCategoryId, ApiPois } from '~/lib/apiPois'
import {
  getPropertyTranslations,
  PropertyTranslations,
} from '~/lib/apiPropertyTranslations'
import { getSettings, headerFromSettings, Settings } from '~/lib/apiSettings'
import { throwFetchError } from '~/lib/throwFetchError'
import { vidoConfig } from '~/plugins/vido-config'
import { menuStore } from '~/stores/menu'
import { siteStore } from '~/stores/site'
import { VidoConfig } from '~/utils/types-config'

export default defineNuxtComponent({
  components: {
    PoisList,
  },

  async setup(): Promise<{
    config: VidoConfig
    settings: Ref<Settings>
    contents: Ref<ContentEntry[]>
    propertyTranslations: Ref<PropertyTranslations>
    id: string
    menuItems: Ref<MenuItem[]>
    pois: Ref<ApiPois>
  }> {
    definePageMeta({
      validate({ params }) {
        return (
          typeof params.id === 'string' && /^[,-_:a-zA-Z0-9]+$/.test(params.id)
        )
      },
    })

    const params = useRoute().params
    const { data: configRef } = await useAsyncData(() =>
      Promise.resolve(
        siteStore().config ||
          vidoConfig(useRequestHeaders(), useRuntimeConfig())
      )
    )
    const config: VidoConfig = configRef.value!

    const fetchSettings = useAsyncData(() =>
      siteStore().settings
        ? Promise.resolve(siteStore().settings as Settings)
        : getSettings(config.API_ENDPOINT, config.API_PROJECT, config.API_THEME)
    )

    const fetchContents = useAsyncData(() =>
      siteStore().contents
        ? Promise.resolve(siteStore().contents as ContentEntry[])
        : getContents(config.API_ENDPOINT, config.API_PROJECT, config.API_THEME)
    )

    const fetchPropertyTranslations = useAsyncData(() =>
      siteStore().translations
        ? Promise.resolve(siteStore().translations as PropertyTranslations)
        : getPropertyTranslations(
            config.API_ENDPOINT,
            config.API_PROJECT,
            config.API_THEME
          )
    )

    const fetchMenuItems = useAsyncData(() =>
      menuStore().menuItems !== undefined
        ? Promise.resolve(Object.values(menuStore().menuItems!))
        : getMenu(config.API_ENDPOINT, config.API_PROJECT, config.API_THEME)
    )

    const getPoiByCategoryIdPromise = useAsyncData(() =>
      getPoiByCategoryId(
        config.API_ENDPOINT,
        config.API_PROJECT,
        config.API_THEME,
        params.id as string,
        {
          geometry_as: 'point',
          short_description: true,
        }
      )
    )
    let [
      { data: settings },
      { data: contents },
      { data: propertyTranslations },
      { data: menuItems },
      { data: pois },
    ] = await Promise.all([
      fetchSettings,
      fetchContents,
      fetchPropertyTranslations,
      fetchMenuItems,
      getPoiByCategoryIdPromise,
    ])
    throwFetchError([
      fetchSettings,
      fetchContents,
      fetchPropertyTranslations,
      fetchMenuItems,
      getPoiByCategoryIdPromise,
    ])

    useHead(headerFromSettings(settings.value!))

    return {
      config,
      settings: settings as Ref<Settings>,
      contents: contents as Ref<ContentEntry[]>,
      propertyTranslations: propertyTranslations as Ref<PropertyTranslations>,
      id: params.id as string,
      menuItems: menuItems as Ref<MenuItem[]>,
      pois: pois as Ref<ApiPois>,
    }
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

  created() {
    this.globalConfig = this.config
    if (this.menuItems) {
      menuStore().fetchConfig(this.menuItems)
    }
    this.globalSettings = this.settings
    this.globalContents = this.contents
    this.globalTranslations = this.propertyTranslations

    this.$settings.set(this.settings)
    this.$propertyTranslations.set(this.propertyTranslations)
  },

  beforeMount() {
    this.$trackingInit(this.config)
    this.$vidoConfigSet(this.config)
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
