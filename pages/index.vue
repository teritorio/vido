<script setup lang="ts">
import type { GeoJSON, MultiPolygon, Polygon } from 'geojson'
import Home from '~/components/Home/Home.vue'
import { useSiteStore } from '~/stores/site'
import { menuStore as useMenuStore } from '~/stores/menu'
import { mapStore as useMapStore } from '~/stores/map'
import type { ApiPoiDeps } from '~/lib/apiPoiDeps'
import type { ApiPoi } from '~/lib/apiPois'

const siteStore = useSiteStore()
const { config, settings } = siteStore

if (!config)
  throw createError({ statusCode: 500, statusMessage: 'Wrong config', fatal: true })

const { API_ENDPOINT, API_PROJECT, API_THEME } = config
const route = useRoute()
const menuStore = useMenuStore()
const mapStore = useMapStore()
const { $trackingInit } = useNuxtApp()

const boundaryGeojson = ref<Polygon | MultiPolygon>()

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

watch(
  () => route.params,
  async (newValue, oldValue) => {
    const { path, name, query } = route
    const newP1 = newValue?.p1?.toString().split(',').map(Number) || []
    const oldP1 = oldValue?.p1?.toString().split(',').map(Number) || []
    const newPoiId = Number(newValue?.poiId?.toString()) || undefined
    const oldPoiId = Number(oldValue?.poiId?.toString()) || undefined

    if (JSON.stringify(newP1) !== JSON.stringify(oldP1)) {
      if (newP1.length === 1 && name === 'index-p1' && !path.endsWith('/')) {
        await fetchOrphanPoi(newP1[0])
        return
      }

      await menuStore.fetchFeatures({
        vidoConfig: config,
        categoryIds: newP1,
        clipingPolygonSlug: query.clipingPolygonSlug?.toString(),
      })
      menuStore.setSelectedCategoryIds(newP1)
    }

    if (newPoiId !== oldPoiId) {
      // TO CHECK:  !poiId.value.includes('_')
      let selectedFeature: ApiPoi | undefined
      if (newPoiId) {
        selectedFeature = menuStore.getFeatureById(newPoiId)
        if (!selectedFeature)
          throw createError({ statusCode: 404, message: 'Feature not found' })
      }

      await mapStore.setSelectedFeature(selectedFeature)
    }
  },
  { immediate: true },
)

async function fetchOrphanPoi(poiId: number) {
  const { data, error, status } = await useFetch<ApiPoiDeps>(
    () => `${API_ENDPOINT}/${API_PROJECT}/${API_THEME}/poi/${poiId}/deps.geojson`,
    {
      query: {
        geometry_as: 'point_or_bbox',
        short_description: false,
      },
    },
  )

  if (error.value)
    throw createError(error.value)

  if (status.value === 'success' && data.value) {
    const feature = data.value.features.find((f) => {
      const id = 'metadata' in f.properties ? f.properties.metadata.id : f.properties.id
      return id === poiId
    })

    if (!feature)
      throw createError({ statusCode: 404, message: 'Feature not found' })

    const featurePoi = feature as ApiPoi
    // Extract category IDs from the feature metadata and join them into a comma‐separated string
    const newCategoryIds = featurePoi.properties.metadata.category_ids
    if (!newCategoryIds || newCategoryIds.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'No category IDs found on the feature',
      })
    }
    const categoryIdsStr = newCategoryIds.join(',')

    const { query, hash } = route
    await navigateTo({
      path: `/${categoryIdsStr}/${poiId}`,
      query,
      hash,
    })
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
