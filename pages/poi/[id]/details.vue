<template>
  <Index
    v-if="settings && poi"
    :settings="settings"
    :nav-menu-entries="contents"
    :poi="poi"
    :poi-deps="poiDeps"
    class="page-details"
  />
</template>

<script lang="ts">
import { groupBy } from 'lodash'
import { mapWritableState } from 'pinia'

import {
  defineNuxtComponent,
  createError,
  useHead,
  useNuxtApp,
  useRequestHeaders,
  useRoute,
  useRuntimeConfig,
} from '#app'
import { definePageMeta } from '#imports'
import Index from '~/components/PoisDetails/PoiDetails.vue'
import { ContentEntry, getContents } from '~/lib/apiContent'
import { ApiPoiDeps, getPoiDepsById } from '~/lib/apiPoiDeps'
import { ApiPoi } from '~/lib/apiPois'
import {
  getPropertyTranslations,
  PropertyTranslations,
} from '~/lib/apiPropertyTranslations'
import { getSettings, headerFromSettings, Settings } from '~/lib/apiSettings'
import { vidoConfig } from '~/plugins/vido-config'
import { siteStore } from '~/stores/site'
import { VidoConfig } from '~/utils/types-config'

export default defineNuxtComponent({
  components: {
    Index,
  },

  async setup(): Promise<{
    config: VidoConfig
    settings: Settings
    contents: ContentEntry[]
    propertyTranslations: PropertyTranslations
    poi: ApiPoi | undefined
    poiDeps: ApiPoiDeps | undefined
  }> {
    definePageMeta({
      validate({ params }) {
        return (
          typeof params.id === 'string' && /^[-_:a-zA-Z0-9]+$/.test(params.id)
        )
      },
    })

    const params = useRoute().params
    const config: VidoConfig =
      siteStore().config || vidoConfig(useRequestHeaders(), useRuntimeConfig())

    const getSettingsPromise = siteStore().settings
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

    const poiDepsPromise = getPoiDepsById(
      config.API_ENDPOINT,
      config.API_PROJECT,
      config.API_THEME,
      params.id as string,
      {
        short_description: false,
      }
    )

    let [settings, contents, propertyTranslations, poiDeps] = await Promise.all(
      [
        getSettingsPromise,
        fetchContents,
        fetchPropertyTranslations,
        poiDepsPromise,
      ]
    )

    let poi: ApiPoi | undefined = undefined
    if (poiDeps) {
      const g = groupBy(
        poiDeps.features,
        (feature) =>
          // @ts-ignore
          feature.properties.metadata?.id == params.id
      )
      poi = g['true'] && (g['true'][0] as ApiPoi)
      poiDeps.features = g['false'] || []
    }

    if (!poi) {
      createError({
        statusCode: 404,
        statusMessage: 'POI not found. Missing main object.',
      })
    }

    useHead(
      headerFromSettings(settings, {
        title: poi?.properties.name,
        description: { fr: poi?.properties.description },
      })
    )

    return Promise.resolve({
      config,
      settings,
      contents,
      propertyTranslations,
      poi,
      poiDeps,
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

  created() {
    this.globalConfig = this.config!
    this.globalSettings = this.settings
    this.globalContents = this.contents
    this.globalTranslations = this.propertyTranslations

    const { $propertyTranslations, $settings } = useNuxtApp()
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

.page-details {
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
