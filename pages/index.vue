<template>
  <Home
    v-if="settings"
    :settings="settings"
    :nav-menu-entries="contents"
    :initial-category-ids="categoryIds || undefined"
    :initial-poi="initialPoi || undefined"
    :boundary-area="boundary_geojson"
  />
</template>

<script lang="ts">
import { Polygon, MultiPolygon, GeoJSON } from 'geojson'
import { mapWritableState } from 'pinia'
import { ref, Ref } from 'vue'

import {
  AsyncData,
  defineNuxtComponent,
  useHead,
  useRequestHeaders,
  useRoute,
  useRuntimeConfig,
} from '#app'
import { useAsyncData } from '#imports'
import Home from '~/components/Home/Home.vue'
import { ContentEntry, getContents } from '~/lib/apiContent'
import { MenuItem, getMenu, ApiMenuCategory } from '~/lib/apiMenu'
import { getPoiById, ApiPoi } from '~/lib/apiPois'
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
    Home,
  },

  async setup(): Promise<{
    config: VidoConfig
    settings: Ref<Settings>
    contents: Ref<ContentEntry[]>
    propertyTranslations: Ref<PropertyTranslations>
    menuItems: Ref<MenuItem[] | null>
    categoryIds: Ref<ApiMenuCategory['id'][] | null>
    initialPoi: Ref<ApiPoi | null>
    boundary_geojson: Ref<Polygon | MultiPolygon | undefined>
  }> {
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

    const fetchSettingsBoundary = fetchSettings.then(
      async ({ data: settings }) => {
        let boundary_geojson: Polygon | MultiPolygon | undefined
        const boundary = useRoute().query.boundary
        if (
          boundary &&
          typeof boundary === 'string' &&
          settings.value!.polygons_extra
        ) {
          const boundaryObject = settings.value!.polygons_extra[boundary]
          if (boundaryObject) {
            if (typeof boundaryObject.data === 'string') {
              const geojson = (await (
                await fetch(boundaryObject.data)
              ).json()) as GeoJSON
              if (geojson.type === 'Feature') {
                boundary_geojson = geojson.geometry as Polygon | MultiPolygon
              } else if (
                geojson.type === 'Polygon' ||
                geojson.type === 'MultiPolygon'
              ) {
                boundary_geojson = geojson as Polygon | MultiPolygon
              }
            } else {
              boundary_geojson = boundaryObject.data as Polygon
            }
          }
        }

        return [settings, ref(boundary_geojson)]
      }
    ) as unknown as [Ref<Settings>, Ref<Polygon | MultiPolygon | undefined>]

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

    let categoryIdsJoin: string | null
    let poiId: string | null
    // Workaround Nuxt missing feature to simple respect trialling slash meaning
    if (params.poiId) {
      categoryIdsJoin = params.p1 as string
      poiId = params.poiId as string
    } else if (useRoute().path.endsWith('/')) {
      categoryIdsJoin = params.p1 as string
      poiId = null
    } else {
      categoryIdsJoin = null
      poiId = params.p1 as string
    }

    const categoryIds = ref(
      (categoryIdsJoin &&
        categoryIdsJoin.split(',').map((id) => parseInt(id))) ||
        null
    )
    let fetchPoi: AsyncData<ApiPoi | null, Error | null> = useAsyncData(() =>
      Promise.resolve(null)
    )
    if (poiId) {
      fetchPoi = useAsyncData(() =>
        getPoiById(
          config.API_ENDPOINT,
          config.API_PROJECT,
          config.API_THEME,
          poiId!,
          {
            short_description: false,
          }
        )
      )
    }

    const [
      [settings, boundary_geojson],
      { data: contents },
      { data: propertyTranslations },
      { data: menuItems },
      { data: initialPoi },
    ] = await Promise.all([
      fetchSettingsBoundary,
      fetchContents,
      fetchPropertyTranslations,
      fetchMenuItems,
      fetchPoi,
    ])
    throwFetchError([
      // fetchSettingsBoundary,
      fetchContents,
      fetchPropertyTranslations,
      fetchMenuItems,
      fetchPoi,
    ])

    useHead(
      headerFromSettings(settings.value!, {
        title: settings.value!.themes[0]?.title.fr,
      })
    )

    return {
      config,
      settings: settings as Ref<Settings>,
      contents: contents as Ref<ContentEntry[]>,
      propertyTranslations: propertyTranslations as Ref<PropertyTranslations>,
      menuItems: menuItems as Ref<MenuItem[] | null>,
      categoryIds: categoryIds as Ref<ApiMenuCategory['id'][] | null>,
      initialPoi: initialPoi as Ref<ApiPoi | null>,
      boundary_geojson,
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

<style scoped>
body,
#__nuxt,
#__layout {
  @apply tw-h-full tw-w-full tw-overflow-hidden tw-overscroll-none;
}
</style>
