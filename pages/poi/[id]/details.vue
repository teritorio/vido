<template>
  <Index
    v-if="settings"
    :settings="settings"
    :nav-menu-entries="contents"
    :poi="poi"
    :poi-deps="poiDeps || undefined"
    :class="['page-details', 'tw-overflow-clip']"
  />
</template>

<script lang="ts">
import { groupBy } from 'lodash'
import { mapWritableState } from 'pinia'
import { Ref, ref } from 'vue'

import {
  defineNuxtComponent,
  useHead,
  useRequestHeaders,
  useRoute,
  showError,
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
import { getAsyncDataOrThrows } from '~/lib/getAsyncData'
import { vidoConfig } from '~/plugins/vido-config'
import { siteStore } from '~/stores/site'
import { VidoConfig } from '~/utils/types-config'

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
      Promise.resolve(siteStore().config || vidoConfig(useRequestHeaders()))
    )
    const config: VidoConfig = configRef.value

    const fetchSettings = getAsyncDataOrThrows('fetchSettings', () =>
      siteStore().settings
        ? Promise.resolve(siteStore().settings as Settings)
        : getSettings(config)
    )

    const fetchContents = getAsyncDataOrThrows('fetchContents', () =>
      siteStore().contents
        ? Promise.resolve(siteStore().contents as ContentEntry[])
        : getContents(config)
    )

    const fetchPropertyTranslations: Promise<Ref<PropertyTranslations>> =
      getAsyncDataOrThrows('fetchPropertyTranslations', () =>
        siteStore().translations
          ? Promise.resolve(siteStore().translations as PropertyTranslations)
          : getPropertyTranslations(config)
      )

    const fetchPoiPoiDeps = getAsyncDataOrThrows(
      `fetchPoiPoiDeps-${params.id}`,
      () => {
        return getPoiDepsById(config, params.id as string, {
          short_description: false,
        }).then((poiDeps) => {
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

          return { poi: ref(poi), poiDeps: ref(poiDeps) }
        })
      }
    )

    const [settings, contents, propertyTranslations, poiPoiDeps] =
      await Promise.all([
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
        // @ts-ignore
        title: poiPoiDeps.value?.poi.properties.name,
        description: {
          // @ts-ignore
          fr: poiPoiDeps.value?.poi.properties.description,
        },
      })
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
body {
  -webkit-print-color-adjust: exact;
}
@media print {
  html,
  body {
    width: 210mm;
    height: 297mm;
  }
}
</style>
