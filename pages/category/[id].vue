<script lang="ts">
import { mapWritableState } from 'pinia'
import type { Ref } from 'vue'

import { defineNuxtComponent, useHead, useRequestHeaders, useRoute } from '#app'
import { definePageMeta } from '#imports'
import PoisList from '~/components/PoisList/PoisList.vue'
import type { ContentEntry } from '~/lib/apiContent'
import { getContents } from '~/lib/apiContent'
import type { ApiMenuCategory, MenuItem } from '~/lib/apiMenu'
import { getMenu } from '~/lib/apiMenu'
import type { ApiPois } from '~/lib/apiPois'
import { getPoiByCategoryId } from '~/lib/apiPois'
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
import { menuStore } from '~/stores/menu'
import { siteStore } from '~/stores/site'
import type { VidoConfig } from '~/utils/types-config'

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

    const fetchMenuItems = getAsyncDataOrThrows('fetchMenuItems', () =>
      menuStore().menuItems !== undefined
        ? Promise.resolve(Object.values(menuStore().menuItems!))
        : getMenu(config))

    const fetchPoiByCategoryId = getAsyncDataOrThrows(
      `fetchPoiByCategoryId-${params.id}`,
      () =>
        getPoiByCategoryId(config, params.id as string, {
          geometry_as: 'point',
          short_description: true,
        }),
    )
    const [settings, contents, propertyTranslations, menuItems, pois]
      = await Promise.all([
        fetchSettings,
        fetchContents,
        fetchPropertyTranslations,
        fetchMenuItems,
        fetchPoiByCategoryId,
      ])

    return {
      config,
      settings,
      contents,
      propertyTranslations,
      id: params.id as string,
      menuItems,
      pois,
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
    if (this.menuItems)
      menuStore().fetchConfig(this.menuItems)

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
    if (siteStore().contribMode) {
      this.pois.features.map((poi) => {
        const { coordinates } = poi.geometry as GeoJSON.Point
        if (poi.properties.metadata.osm_id && poi.properties.metadata.osm_type) {
          if (poi.properties.mapillary) {
            poi.properties.mapillary_link = `https://www.mapillary.com/app/?pKey=${poi.properties.mapillary}&focus=photo`
            poi.properties.editorial?.list_fields?.push({ field: 'mapillary_link' })
          }

          poi.properties.editor_id = `https://www.openstreetmap.org/edit?node=${poi.properties.metadata.osm_id}`
          poi.properties.osm_note = `https://www.openstreetmap.org/note/new#map=19/${coordinates[1]}/${coordinates[0]}&layers=N`
          poi.properties.editorial?.list_fields?.push({ field: 'editor_id' }, { field: 'osm_note' }, { field: 'mapillary_link' })
        }

        return poi
      })
    }
    this.handleCategoryUpdate(useRoute().params.id as string)
  },
  methods: {
    getCategory(categoryId: string): ApiMenuCategory {
      // Fetching category by ID
      // TODO: Has to be done in setup() but menuItems is touched in created() hook
      const category = menuStore().getCurrentCategory(categoryId)
      if (!category) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Category Not Found',
        })
      }
      return category
    },
    handleCategoryUpdate(categoryId: number | string) {
      const category = this.getCategory(categoryId.toString())
      this.settings.themes[0].title = category.category.name
      useHead(headerFromSettings(this.settings))
    },
  },
})
</script>

<template>
  <PoisList
    :settings="settings"
    :nav-menu-entries="contents"
    :initial-category-id="parseInt(id)"
    :initial-pois="pois"
    class="page-index"
    @category-update="handleCategoryUpdate"
  />
</template>

<style lang="scss" scoped>
@import '~/assets/details';

.page-index {
  color: $color-text;
  background-color: #fefefe;
  padding: 1rem;
  min-width: 21rem;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizelegibility;
  line-height: 1.3;
  word-wrap: break-word;

  @extend %font-light;
}
</style>
