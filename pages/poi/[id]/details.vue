<script lang="ts">
import { groupBy } from 'lodash'
import { mapWritableState } from 'pinia'
import type { Ref } from 'vue'
import { ref } from 'vue'

import {
  defineNuxtComponent,
  showError,
  useHead,
  useRequestHeaders,
  useRoute,
} from '#app'
import { definePageMeta } from '#imports'
import Index from '~/components/PoisDetails/PoiDetails.vue'
import type { ContentEntry } from '~/lib/apiContent'
import { getContents } from '~/lib/apiContent'
import type { ApiPoiDeps } from '~/lib/apiPoiDeps'
import { getPoiDepsById } from '~/lib/apiPoiDeps'
import type { ApiPoi } from '~/lib/apiPois'
import type {
  PropertyTranslations,
} from '~/lib/apiPropertyTranslations'
import {
  getPropertyTranslations,
} from '~/lib/apiPropertyTranslations'
import type { Settings } from '~/lib/apiSettings'
import { getSettings, headerFromSettings } from '~/lib/apiSettings'
import { getAsyncDataOrThrows } from '~/lib/getAsyncData'
import { vidoConfig } from '~/plugins/vido-config'
import { siteStore } from '~/stores/site'
import type { VidoConfig } from '~/utils/types-config'

export default defineNuxtComponent({
  components: {
    Index,
  },

  async setup(): Promise<{
    config: VidoConfig
    settings: Ref<Settings>
    contents: Ref<ContentEntry[]>
    propertyTranslations: Ref<PropertyTranslations>
    poi: Ref<ApiPoi>
    poiDeps: Ref<ApiPoiDeps | null>
  }> {
    definePageMeta({
      validate({ params }) {
        return (
          typeof params.id === 'string' && /^[-_:a-zA-Z0-9]+$/.test(params.id)
        )
      },
    })

    const params = useRoute().params
    const configRef = await getAsyncDataOrThrows('configRef', () =>
      Promise.resolve(siteStore().config || vidoConfig(useRequestHeaders())))
    const config: VidoConfig = configRef.value

    const fetchSettings = getAsyncDataOrThrows('fetchSettings', () =>
      siteStore().settings
        ? Promise.resolve(siteStore().settings as Settings)
        : getSettings(config))

    const fetchContents = getAsyncDataOrThrows('fetchContents', () =>
      siteStore().contents
        ? Promise.resolve(siteStore().contents as ContentEntry[])
        : getContents(config))

    const fetchPropertyTranslations: Promise<Ref<PropertyTranslations>>
      = getAsyncDataOrThrows('fetchPropertyTranslations', () =>
        siteStore().translations
          ? Promise.resolve(siteStore().translations as PropertyTranslations)
          : getPropertyTranslations(config))

    const fetchPoiPoiDeps = getAsyncDataOrThrows(
      `fetchPoiPoiDeps-${params.id}`,
      () => {
        return getPoiDepsById(config, params.id as string, {
          short_description: false,
        }).then((poiDeps) => {
          let poi: ApiPoi | undefined
          if (poiDeps) {
            const g = groupBy(
              poiDeps.features,
              feature =>
                // @ts-expect-error
                feature.properties.metadata?.id == params.id,
            )
            poi = g.true && (g.true[0] as ApiPoi)
            poiDeps.features = g.false || []
          }

          return { poi: ref(poi), poiDeps: ref(poiDeps) }
        })
      },
    )

    const [settings, contents, propertyTranslations, poiPoiDeps]
      = await Promise.all([
        fetchSettings,
        fetchContents,
        fetchPropertyTranslations,
        fetchPoiPoiDeps,
      ])

    if (!poiPoiDeps.value?.poi || poiPoiDeps.value?.poi.value) {
      showError({
        statusCode: 404,
        statusMessage: 'POI not found. Missing main object.',
      })
    }
    useHead(
      headerFromSettings(settings.value, {
        // @ts-expect-error
        title: poiPoiDeps.value?.poi.properties.name,
        description: {
          // @ts-expect-error
          fr: poiPoiDeps.value?.poi.properties.description,
        },
      }),
    )

    return {
      config,
      settings,
      contents,
      propertyTranslations,
      poi: poiPoiDeps.value.poi as Ref<ApiPoi>,
      poiDeps: poiPoiDeps.value.poiDeps,
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

<template>
  <Index
    v-if="settings"
    :settings="settings"
    :nav-menu-entries="contents"
    :poi="poi"
    :poi-deps="poiDeps || undefined"
    class="page-details tw-overflow-clip"
  />
</template>

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

<style>
body,
#__nuxt,
#__layout {
  -webkit-print-color-adjust: exact;
}

img,
.poi-deck,
.poi-map,
#route-map {
  page-break-before: auto;
  page-break-after: auto;
  page-break-inside: avoid;
}
</style>
