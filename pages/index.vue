<script setup lang="ts">
import type { GeoJSON, MultiPolygon, Polygon } from 'geojson'
import Home from '~/components/Home/Home.vue'
import type { ApiPoi } from '~/lib/apiPois'
import { useSiteStore } from '~/stores/site'
import { mapStore as useMapStore } from '~/stores/map'
import { regexForCategoryIds } from '~/composables/useIdsResolver'

//
// Composables
//
const route = useRoute()
const mapStore = useMapStore()
const siteStore = useSiteStore()
const { config, settings } = siteStore
const { API_ENDPOINT, API_PROJECT, API_THEME } = config!
const { $trackingInit } = useNuxtApp()

//
// Data
//
const boundaryGeojson = ref<Polygon | MultiPolygon>()
const poiId = ref<string>()
const categoryIds = ref<number[]>()

//
// Hooks
//
onBeforeMount(() => {
  $trackingInit(config!)
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

if (route.params.poiId)
  poiId.value = route.params.poiId.toString()

// Fetch inital POI
const { data, error, status } = await useFetch<ApiPoi>(
  () => `${API_ENDPOINT}/${API_PROJECT}/${API_THEME}/poi/${poiId.value}.geojson`,
  {
    query: {
      geometry_as: 'bbox',
      short_description: true,
    },
    immediate: !!poiId.value && !poiId.value.includes('_'),
  },
)

if (error.value)
  createError(error.value)

if (status.value === 'success' && data.value)
  mapStore.setSelectedFeature(data.value)
</script>

<template>
  <VApp>
    <VAlert
      v-if="error"
      :closable="true"
      :style="{ zIndex: 999 }"
      :text="error.message"
      location="top center"
      position="fixed"
      type="error"
      variant="elevated"
    />
    <Home
      :boundary-area="boundaryGeojson"
      :initial-category-ids="categoryIds"
    />
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
