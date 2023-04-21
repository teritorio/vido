<template>
  <Embedded
    :settings="settings"
    :initial-category-ids="categoryIds || undefined"
    :initial-poi="initialPoi || undefined"
    :boundary-area="boundary_geojson"
  />
</template>

<script lang="ts">
import { Polygon, MultiPolygon, GeoJSON } from 'geojson'
import { mapWritableState } from 'pinia'
import { ref, Ref } from 'vue'

import { defineNuxtComponent, useHead, useRequestHeaders, useRoute } from '#app'
import Embedded from '~/components/Home/Embedded.vue'
import { ApiMenuCategory, getMenu, MenuItem } from '~/lib/apiMenu'
import { getPoiById, ApiPoi } from '~/lib/apiPois'
import {
  getPropertyTranslations,
  PropertyTranslations,
} from '~/lib/apiPropertyTranslations'
import { getSettings, headerFromSettings, Settings } from '~/lib/apiSettings'
import { getAsyncDataOrNull, getAsyncDataOrThrows } from '~/lib/getAsyncData'
import { vidoConfig } from '~/plugins/vido-config'
import { menuStore } from '~/stores/menu'
import { siteStore } from '~/stores/site'
import { VidoConfig } from '~/utils/types-config'

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
      Promise.resolve(vidoConfig(useRequestHeaders()))
    )
    const config: VidoConfig = configRef.value

    const fetchSettings = getAsyncDataOrThrows('fetchSettings', () =>
      getSettings(config.API_ENDPOINT, config.API_PROJECT, config.API_THEME)
    )

    const fetchSettingsBoundary = fetchSettings.then(async (settings) => {
      let boundary_geojson: Polygon | MultiPolygon | undefined
      const boundary = useRoute().query.boundary
      if (
        boundary &&
        typeof boundary === 'string' &&
        settings.value.polygons_extra
      ) {
        const boundaryObject = settings.value.polygons_extra[boundary]
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
    }) as unknown as [Ref<Settings>, Ref<Polygon | MultiPolygon | undefined>]

    const fetchPropertyTranslations: Promise<Ref<PropertyTranslations>> =
      getAsyncDataOrThrows('fetchPropertyTranslations', () =>
        getPropertyTranslations(
          config.API_ENDPOINT,
          config.API_PROJECT,
          config.API_THEME
        )
      )

    const fetchMenuItems = getAsyncDataOrThrows('fetchMenuItems', () =>
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
    let fetchPoi: Promise<Ref<ApiPoi | null>> = getAsyncDataOrNull(
      'fetchPoiNull',
      () => Promise.resolve(null)
    )
    if (poiId) {
      fetchPoi = getAsyncDataOrNull(`fetchPoi-${poiId}`, () =>
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
    }),
  },

  created() {
    if (this.menuItems) {
      menuStore().fetchConfig(this.menuItems)
    }
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
