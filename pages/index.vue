<script setup lang="ts">
import type { GeoJSON, MultiPolygon, Polygon } from 'geojson'
import { storeToRefs } from 'pinia'
import Home from '~/components/Home/Home.vue'
import { useSiteStore } from '~/stores/site'
import { menuStore as useMenuStore } from '~/stores/menu'
import { regexForCategoryIds } from '~/composables/useIdsResolver'

const siteStore = useSiteStore()
const { config, settings } = siteStore

if (!config)
  throw createError({ statusCode: 500, statusMessage: 'Wrong config', fatal: true })

const route = useRoute()
const menuStore = useMenuStore()
const { $trackingInit } = useNuxtApp()

const boundaryGeojson = ref<Polygon | MultiPolygon>()
const poiId = ref<string>()
const categoryIds = ref<number[]>([])

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

watch(() => route.params, () => {
  categoryIds.value = []
  // Get category IDs from URL
  if (route.params.p1) {
    const match = route.params.p1.toString().match(regexForCategoryIds)

    if (!match || (route.path.endsWith('/') && match.groups && (match.groups.cartocode || match.groups.reference || match.groups.osm)))
      throw createError({ statusCode: 400, message: `No match for category ID: ${route.params.p1}` })

    categoryIds.value = (match.input?.split(',').map(id => Number.parseInt(id))) || []
  }

  // Get POI ID from URL
  if (categoryIds.value.length === 1 && route.name === 'index-p1' && !route.path.endsWith('/')) {
    poiId.value = route.params.p1?.toString()
    categoryIds.value = []
  }

  // if (route.params.poiId) {
  //     poiId.value = route.params.poiId.toString()

  //     // TO CHECK:  !poiId.value.includes('_')
  //     const selectedFeature = menuStore.getFeatureById(Number.parseInt(poiId.value))
  //     if (selectedFeature) {
  //       await mapStore.setSelectedFeature(selectedFeature)
  //       console.info('selected feature is set in index !')
  //     }
  //   }

  menuStore.fetchFeatures({
    vidoConfig: config,
    categoryIds: categoryIds.value,
    clipingPolygonSlug: route.query.clipingPolygonSlug?.toString(),
  })

  menuStore.setSelectedCategoryIds(categoryIds.value)
}, { immediate: true })
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
