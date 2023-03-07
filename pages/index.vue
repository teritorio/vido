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
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'

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

export default Vue.extend({
  components: {
    Home,
  },

  async asyncData({ params, route, req, $config, $pinia }): Promise<{
    config: VidoConfig
    settings: Settings
    contents: ContentEntry[]
    propertyTranslations: PropertyTranslations
    menuItems: MenuItem[] | undefined
    categoryIds: ApiMenuCategory['id'][] | undefined
    initialPoi: ApiPoi | undefined
    boundary_geojson: Polygon | MultiPolygon | undefined
  }> {
    const config: VidoConfig =
      siteStore($pinia).config || vidoConfig(req, $config)

    const fetchSettings = siteStore($pinia).settings
      ? Promise.resolve(siteStore($pinia).settings as Settings)
      : getSettings(config.API_ENDPOINT, config.API_PROJECT, config.API_THEME)

    const fetchSettingsBoundary = fetchSettings.then(async (settings) => {
      let boundary_geojson: Polygon | MultiPolygon | undefined
      if (route.query.boundary && typeof route.query.boundary === 'string') {
        const boundaryObject = settings.polygons_extra[route.query.boundary]
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

    const fetchContents = siteStore($pinia).contents
      ? Promise.resolve(siteStore($pinia).contents as ContentEntry[])
      : getContents(config.API_ENDPOINT, config.API_PROJECT, config.API_THEME)

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
      undefined
    let fetchPoi: Promise<ApiPoi | undefined> = Promise.resolve(undefined)
    if (poiId) {
      fetchPoi = Promise.resolve(
        getPoiById(
          config.API_ENDPOINT,
          config.API_PROJECT,
          config.API_THEME,
          poiId!
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

  data(): {
    config: VidoConfig | null
    settings: Settings
    contents: ContentEntry[]
    propertyTranslations: PropertyTranslations
    menuItems: MenuItem[]
    categoryIds: ApiMenuCategory['id'][] | null
    initialPoi: ApiPoi | undefined
    boundary_geojson: Polygon | MultiPolygon | undefined
  } {
    return {
      config: null,
      // @ts-ignore
      settings: null,
      // @ts-ignore
      contents: null,
      // @ts-ignore
      propertyTranslations: null,
      // @ts-ignore
      menuItems: null,
      categoryIds: null,
      initialPoi: undefined,
    }
  },

  head(): MetaInfo {
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
  @apply h-full w-full overflow-hidden overscroll-none;
}
</style>
