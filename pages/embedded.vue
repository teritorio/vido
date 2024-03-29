<script lang="ts">
import type { GeoJSON, MultiPolygon, Polygon } from 'geojson'
import { mapWritableState } from 'pinia'
import type { Ref } from 'vue'
import { ref } from 'vue'

import { defineNuxtComponent, useHead, useRequestHeaders, useRoute } from '#app'
import Embedded from '~/components/Home/Embedded.vue'
import type { ApiMenuCategory, MenuItem } from '~/lib/apiMenu'
import { getMenu } from '~/lib/apiMenu'
import type { ApiPoi } from '~/lib/apiPois'
import { getPoiById } from '~/lib/apiPois'
import type {
  PropertyTranslations,
} from '~/lib/apiPropertyTranslations'
import {
  getPropertyTranslations,
} from '~/lib/apiPropertyTranslations'
import type { Settings } from '~/lib/apiSettings'
import { getSettings, headerFromSettings } from '~/lib/apiSettings'
import { getAsyncDataOrNull, getAsyncDataOrThrows } from '~/lib/getAsyncData'
import { vidoConfig } from '~/plugins/vido-config'
import { menuStore } from '~/stores/menu'
import { siteStore } from '~/stores/site'
import type { VidoConfig } from '~/utils/types-config'

export default defineNuxtComponent({
  components: {
    Embedded,
  },

  async setup(): Promise<{
    config: VidoConfig
    settings: Ref<Settings>
    propertyTranslations: Ref<PropertyTranslations>
    menuItems: Ref<MenuItem[]>
    categoryIds: Ref<ApiMenuCategory['id'][] | null>
    initialPoi: Ref<ApiPoi | null>
    boundary_geojson: Ref<Polygon | MultiPolygon | undefined>
  }> {
    const params = useRoute().params
    const configRef = await getAsyncDataOrThrows('configRef', () =>
      Promise.resolve(siteStore().config || vidoConfig(useRequestHeaders())))
    const config: VidoConfig = configRef.value

    const fetchSettings = getAsyncDataOrThrows('fetchSettings', () =>
      siteStore().settings
        ? Promise.resolve(siteStore().settings as Settings)
        : getSettings(config))

    const fetchSettingsBoundary = fetchSettings.then(async (settings) => {
      let boundary_geojson: Polygon | MultiPolygon | undefined
      const boundary = useRoute().query.boundary
      if (
        boundary
        && typeof boundary === 'string'
        && settings.value.polygons_extra
      ) {
        const boundaryObject = settings.value.polygons_extra[boundary]
        if (boundaryObject) {
          if (typeof boundaryObject.data === 'string') {
            const geojson = (await (
              await fetch(boundaryObject.data)
            ).json()) as GeoJSON
            if (geojson.type === 'Feature')
              boundary_geojson = geojson.geometry as Polygon | MultiPolygon
            else if (
              geojson.type === 'Polygon'
              || geojson.type === 'MultiPolygon'
            )
              boundary_geojson = geojson as Polygon | MultiPolygon
          }
          else {
            boundary_geojson = boundaryObject.data as Polygon
          }
        }
      }

      return [settings, ref(boundary_geojson)]
    }) as unknown as [Ref<Settings>, Ref<Polygon | MultiPolygon | undefined>]

    const fetchPropertyTranslations: Promise<Ref<PropertyTranslations>>
      = getAsyncDataOrThrows('fetchPropertyTranslations', () =>
        siteStore().translations
          ? Promise.resolve(siteStore().translations as PropertyTranslations)
          : getPropertyTranslations(config))

    const fetchMenuItems = getAsyncDataOrThrows('fetchMenuItems', () =>
      menuStore().menuItems !== undefined
        ? Promise.resolve(Object.values(menuStore().menuItems!))
        : getMenu(config))

    let categoryIdsJoin: string | null
    let poiId: string | null
    // Workaround Nuxt missing feature to simple respect trialling slash meaning
    if (params.poiId) {
      categoryIdsJoin = params.p1 as string
      poiId = params.poiId as string
    }
    else if (useRoute().path.endsWith('/')) {
      categoryIdsJoin = params.p1 as string
      poiId = null
    }
    else {
      categoryIdsJoin = null
      poiId = params.p1 as string
    }

    const categoryIds = ref(
      (categoryIdsJoin
      && categoryIdsJoin.split(',').map(id => Number.parseInt(id)))
      || null,
    )
    let fetchPoi: Promise<Ref<ApiPoi | null>> = getAsyncDataOrNull(
      'fetchPoiNull',
      () => Promise.resolve(null),
    )
    if (poiId) {
      fetchPoi = getAsyncDataOrNull(`fetchPoi-${poiId}`, () =>
        getPoiById(config, poiId!, {
          short_description: false,
        }))
    }

    const [
      [settings, boundary_geojson],
      propertyTranslations,
      menuItems,
      initialPoi,
    ] = await Promise.all([
      fetchSettingsBoundary,
      fetchPropertyTranslations,
      fetchMenuItems,
      fetchPoi,
    ])

    useHead(headerFromSettings(settings.value))

    return {
      config,
      settings,
      propertyTranslations,
      menuItems,
      categoryIds,
      initialPoi,
      boundary_geojson,
    }
  },

  computed: {
    ...mapWritableState(siteStore, {
      locale: 'locale',
      globalConfig: 'config',
      globalSettings: 'settings',
      globalTranslations: 'translations',
    }),
  },

  created() {
    this.globalConfig = this.config
    if (this.menuItems)
      menuStore().fetchConfig(this.menuItems)

    this.globalSettings = this.settings
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
  <Embedded
    :settings="settings"
    :initial-category-ids="categoryIds || undefined"
    :initial-poi="initialPoi || undefined"
    :boundary-area="boundary_geojson"
  />
</template>

<style scoped>
/* stylelint-disable selector-id-pattern */
body,
#__nuxt,
#__layout {
  @apply tw-h-full tw-w-full tw-overflow-hidden tw-overscroll-none;
}
</style>
