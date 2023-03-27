<template>
  <Home
    v-if="settings"
    :settings="settings"
    :nav-menu-entries="contents"
    :initial-category-ids="categoryIds"
    :initial-poi="initialPoi"
    :boundary-area="boundary_geojson"
  />
</template>

<script lang="ts">
import { Polygon, MultiPolygon, GeoJSON } from 'geojson'
import { mapWritableState } from 'pinia'

import {
  defineNuxtComponent,
  useHead,
  useRequestHeaders,
  useRoute,
  useRuntimeConfig,
} from '#app'
import Home from '~/components/Home/Home.vue'
import { ContentEntry, getContents } from '~/lib/apiContent'
import { MenuItem, getMenu, ApiMenuCategory } from '~/lib/apiMenu'
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

export default defineNuxtComponent({
  components: {
    Home,
  },

  async setup(): Promise<{
    config: VidoConfig
    settings: Settings
    contents: ContentEntry[]
    propertyTranslations: PropertyTranslations
    menuItems: MenuItem[] | undefined
    categoryIds: ApiMenuCategory['id'][] | undefined
    initialPoi: ApiPoi | undefined
    boundary_geojson: Polygon | MultiPolygon | undefined
  }> {
    const params = useRoute().params
    const config: VidoConfig =
      siteStore().config || vidoConfig(useRequestHeaders(), useRuntimeConfig())

    const fetchSettings = siteStore().settings
      ? Promise.resolve(siteStore().settings as Settings)
      : getSettings(config.API_ENDPOINT, config.API_PROJECT, config.API_THEME)

    const fetchSettingsBoundary = fetchSettings.then(async (settings) => {
      let boundary_geojson: Polygon | MultiPolygon | undefined
      const boundary = useRoute().query.boundary
      if (boundary && typeof boundary === 'string' && settings.polygons_extra) {
        const boundaryObject = settings.polygons_extra[boundary]
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

      return [settings, boundary_geojson]
    }) as unknown as [Settings, Polygon | MultiPolygon | undefined]

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

    const fetchMenuItems = menuStore().menuItems
      ? Promise.resolve(undefined)
      : getMenu(config.API_ENDPOINT, config.API_PROJECT, config.API_THEME)

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

    const categoryIds =
      (categoryIdsJoin &&
        categoryIdsJoin.split(',').map((id) => parseInt(id))) ||
      undefined
    let fetchPoi: Promise<ApiPoi | undefined> = Promise.resolve(undefined)
    if (poiId) {
      fetchPoi = Promise.resolve(
        getPoiById(
          config.API_ENDPOINT,
          config.API_PROJECT,
          config.API_THEME,
          poiId!,
          {
            short_description: false,
          }
        )
      ).catch(() => {
        return undefined
      })
    }

    const [
      [settings, boundary_geojson],
      contents,
      propertyTranslations,
      menuItems,
      initialPoi,
    ] = await Promise.all([
      fetchSettingsBoundary,
      fetchContents,
      fetchPropertyTranslations,
      fetchMenuItems,
      fetchPoi,
    ])

    useHead(
      headerFromSettings(settings, {
        title: settings.themes[0]?.title.fr,
      })
    )

    return Promise.resolve({
      config,
      settings,
      contents,
      propertyTranslations,
      menuItems,
      categoryIds,
      initialPoi,
      boundary_geojson,
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
    this.$trackingInit(this.config!)
    this.$vidoConfigSet(this.config!)
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
