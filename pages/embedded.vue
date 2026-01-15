<script setup lang="ts">
import type { GeoJSON, MultiPolygon, Polygon } from 'geojson'
import { storeToRefs } from 'pinia'
import type { GeoJSONFeature } from 'maplibre-gl'
import Embedded from '~/components/Home/Embedded.vue'
import type { ApiPoi } from '~/types/api/poi'
import { useSiteStore } from '~/stores/site'
import { mapStore as useMapStore } from '~/stores/map'
import { menuStore as useMenuStore } from '~/stores/menu'
import { regexForCategoryIds } from '~/composables/useIdsResolver'
import type { Poi } from '~/types/local/poi'
import type { ApiPoiDepsCollection, ApiPoiUnion } from '~/types/api/poi-deps'
import type { PoiUnion } from '~/types/local/poi-deps'

const siteStore = useSiteStore()
const { settings } = storeToRefs(siteStore)
const apiEndpoint = useState('api-endpoint')

const route = useRoute()
const mapStore = useMapStore()
const { $trackingInit } = useNuxtApp()
const menuStore = useMenuStore()
const poiDepsCompo = usePoiDeps()
const { teritorioCluster } = storeToRefs(mapStore)
const { selectedCategoryIds, apiMenuCategory } = storeToRefs(menuStore)

const mainPoi = ref<ApiPoi>()
const boundaryGeojson = ref<Polygon | MultiPolygon>()
const poiId = ref<string>()
const categoryIds = ref<number[]>([])

// Disable Favorite Mode
siteStore.setFavoritesMode(false)

const { boundary } = route.query
if (boundary && typeof boundary === 'string' && settings.value?.polygons_extra) {
  const boundaryObject = settings.value.polygons_extra[boundary]

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

  const catString = match.input?.split(',').map(id => Number.parseInt(id))

  if (catString)
    categoryIds.value = catString
}

// Get POI ID from URL
if (categoryIds.value.length === 1 && route.name === 'index-p1' && !route.path.endsWith('/')) {
  poiId.value = route.params.p1?.toString()
  categoryIds.value = []
}

if (route.params.poiId) {
  poiId.value = route.params.poiId.toString()
}

if (!categoryIds.value.length) {
  categoryIds.value = []

  if (apiMenuCategory.value) {
    apiMenuCategory.value.forEach((category) => {
      if (category.selected_by_default)
        categoryIds.value.push(category.id)
    })
  }
}

menuStore.setSelectedCategoryIds(categoryIds.value)

const { data, error, status } = await useAsyncData('features', async () => {
  await menuStore.fetchFeatures({
    categoryIds: categoryIds.value || [],
    clipingPolygonSlug: route.query.clipingPolygonSlug?.toString(),
  })

  let initialFeature: ApiPoiDepsCollection | undefined
  if (poiId.value && !poiId.value.includes('_')) {
    initialFeature = await $fetch<ApiPoiDepsCollection>(`${apiEndpoint.value}/poi/${poiId.value}/deps.geojson`, {
      query: {
        geometry_as: 'point',
        short_description: true,
      },
    })
  }

  return initialFeature
}, {
  transform: data => transformApiPoiDepsCollection(data),
})

if (error.value)
  throw createError(error.value)

if (status.value === 'success' && data.value) {
  data.value.forEach((f) => {
    mapStore.addSelectedFeatureDepsIDs(f.properties.metadata.id)
  })

  if (mainPoi.value) {
    const poi = data.value.find(f => f.properties.metadata.id === mainPoi.value!.properties.metadata.id)
    mapStore.setSelectedFeature(poi as Poi)

    // In case user click on vecto element, attach Pin Marker to POI Marker
    teritorioCluster.value?.setSelectedFeature(mainPoi.value as unknown as GeoJSONFeature)

    if (poi) {
      const currentCategory = selectedCategoryIds.value.find(id => poi.properties.metadata.category_ids!.includes(id))

      if (currentCategory) {
        menuStore.filterByDeps(currentCategory, data.value)

        if (data.value.length > 1)
          mapStore.setIsDepsView(true)
        else
          mapStore.setIsDepsView(false)
      }
    }
  }
}

function getMainPoi(features: ApiPoiUnion[]): ApiPoi {
  let poi: ApiPoiUnion | undefined
  const isRefPoiId = Number.isNaN(Number(poiId.value))

  if (isRefPoiId && poiId.value) {
    const refSplit = poiId.value.split(':')
    const idValue = refSplit.pop()
    const key = refSplit.join(':')
    poi = features.find(f => f.properties[key] === idValue)
  }
  else {
    poi = features.find(f => (f.properties.metadata.id === Number(poiId.value)))
  }

  if (!poi)
    throw createError(`Feature with ID: ${poiId.value} not found.`)

  return poi as ApiPoi
}

function transformApiPoiDepsCollection(data?: ApiPoiDepsCollection): PoiUnion[] | undefined {
  poiDepsCompo.resetWaypointIndex()

  if (!data)
    return undefined

  mainPoi.value = getMainPoi(data.features)

  return poiDepsCompo.formatPoiDepsCollection(data, mainPoi.value.properties.metadata.id)
}

onBeforeMount(() => {
  $trackingInit()
})
</script>

<template>
  <Embedded
    :boundary-area="boundaryGeojson"
    :initial-category-ids="categoryIds"
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
