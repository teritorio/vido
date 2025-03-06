<script setup lang="ts">
import type { GeoJSON, MultiPolygon, Polygon } from 'geojson'
import { storeToRefs } from 'pinia'
import Home from '~/components/Home/Home.vue'
import { useSiteStore } from '~/stores/site'
import { menuStore as useMenuStore } from '~/stores/menu'
import { mapStore as useMapStore } from '~/stores/map'
import { regexForCategoryIds } from '~/composables/useIdsResolver'
import type { ApiMenuCategory } from '~/lib/apiMenu'

const route = useRoute()
const mapStore = useMapStore()
const siteStore = useSiteStore()
const menuStore = useMenuStore()
const { apiMenuCategory } = storeToRefs(menuStore)
const { config, settings } = siteStore

if (!config)
  throw createError({ statusCode: 500, statusMessage: 'Wrong config', fatal: true })

const { $trackingInit } = useNuxtApp()

const boundaryGeojson = ref<Polygon | MultiPolygon>()
const poiId = ref<string>()
const categoryIds = ref<number[]>()

onBeforeMount(() => {
  $trackingInit(config)
})

const { boundary } = route.query
if (boundary && typeof boundary === 'string' && settings!.polygons_extra) {
  const boundaryObject = settings!.polygons_extra[boundary]
  if (boundaryObject) {
    if (typeof boundaryObject.data === 'string') {
      const geojson = (await (await fetch(boundaryObject.data)).json()) as GeoJSON

      if (geojson.type === 'Feature') {
        boundaryGeojson.value = geojson.geometry as Polygon | MultiPolygon
      }
      else if (geojson.type === 'Polygon' || geojson.type === 'MultiPolygon') {
        boundaryGeojson.value = geojson as Polygon | MultiPolygon
      }
    }
    else {
      boundaryGeojson.value = boundaryObject.data as Polygon
    }
  }
}

// Get category IDs from URL
if (route.params.p1) {
  const match = route.params.p1.toString().match(regexForCategoryIds)

  if (!match || (route.path.endsWith('/') && match.groups && (match.groups.cartocode || match.groups.reference || match.groups.osm)))
    throw createError({ statusCode: 400, message: `No match for category ID: ${route.params.p1}` })

  categoryIds.value = match.input?.split(',').map(id => Number.parseInt(id))
}

// Get POI ID from URL
if (categoryIds.value?.length === 1 && route.name === 'index-p1' && !route.path.endsWith('/')) {
  poiId.value = route.params.p1?.toString()
  categoryIds.value = undefined
}

if (categoryIds.value) {
  await menuStore.fetchFeatures({
    vidoConfig: config,
    categoryIds: categoryIds.value,
    clipingPolygonSlug: route.query.clipingPolygonSlug?.toString(),
  })
  menuStore.setSelectedCategoryIds(categoryIds.value)
}
else if (typeof location !== 'undefined') {
  const enabledCategories: ApiMenuCategory['id'][] = []

  if (apiMenuCategory.value) {
    apiMenuCategory.value.forEach((category) => {
      if (category.selected_by_default)
        enabledCategories.push(category.id)
    })
  }

  menuStore.setSelectedCategoryIds(enabledCategories)
}

if (route.params.poiId) {
  poiId.value = route.params.poiId.toString()

  // TO CHECK:  !poiId.value.includes('_')
  const selectedFeature = menuStore.getFeatureById(Number.parseInt(poiId.value))
  if (selectedFeature) {
    await mapStore.setSelectedFeature(selectedFeature)
  }
}
</script>

<template>
  <VApp>
    <Home :boundary-area="boundaryGeojson" />
  </VApp>
</template>

<style scoped>
/* stylelint-disable selector-id-pattern */
body,
#__nuxt,
#__layout {
  @apply tw-h-full tw-w-full tw-overflow-hidden tw-overscroll-none;
}
</style>
