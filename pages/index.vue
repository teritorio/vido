<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { GeoJSON, MultiPolygon, Polygon } from 'geojson'
import type { MapGeoJSONFeature } from 'maplibre-gl'
import type { ApiPoi } from '~/lib/apiPois'
import { type ApiPoiDeps, type ApiRouteWaypoint, ApiRouteWaypointType, apiRouteWaypointToApiPoi, iconMap } from '~/lib/apiPoiDeps'
import Home from '~/components/Home/Home.vue'
import { useSiteStore } from '~/stores/site'
import { menuStore as useMenuStore } from '~/stores/menu'
import { mapStore as useMapStore } from '~/stores/map'
import { regexForCategoryIds } from '~/composables/useIdsResolver'
import type { ApiMenuCategory } from '~/lib/apiMenu'

const siteStore = useSiteStore()
const { config, settings } = storeToRefs(siteStore)

if (!config.value)
  throw createError({ statusCode: 500, statusMessage: 'Wrong config', fatal: true })

const route = useRoute()
const mapStore = useMapStore()
const { API_ENDPOINT, API_PROJECT, API_THEME } = config.value
const { $trackingInit } = useNuxtApp()

const boundaryGeojson = ref<Polygon | MultiPolygon>()
const poiId = ref<number>()
const categoryIds = ref<number[]>()

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

  categoryIds.value = match.input?.split(',').map(id => Number.parseInt(id))
}

// Get POI ID from URL
if (categoryIds.value?.length === 1 && route.name === 'index-p1' && !route.path.endsWith('/')) {
  poiId.value = Number(route.params.p1?.toString())
  categoryIds.value = undefined
}

if (route.params.poiId) {
  poiId.value = Number(route.params.poiId.toString())
}

const menuStore = useMenuStore()
const { apiMenuCategory, selectedCategoryIds } = storeToRefs(menuStore)
onBeforeMount(() => {
  $trackingInit(config.value!)

  // TODO: It could be processed on server-side ?
  if (categoryIds.value) {
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
})

const { teritorioCluster } = storeToRefs(mapStore)
const { data, error, status } = await useAsyncData('features', async () => {
  await menuStore.fetchFeatures({
    vidoConfig: config.value!,
    categoryIds: selectedCategoryIds.value || [],
    clipingPolygonSlug: route.query.clipingPolygonSlug?.toString(),
  })

  let initialFeature: ApiPoiDeps | undefined
  if (poiId.value && !poiId.value.toString().includes('_')) {
    initialFeature = await $fetch<ApiPoiDeps>(`${API_ENDPOINT}/${API_PROJECT}/${API_THEME}/poi/${poiId.value}/deps.geojson`, {
      query: {
        geometry_as: 'point',
        short_description: false,
      },
    })
  }

  return initialFeature
})

if (error.value)
  throw createError(error.value)

if (status.value === 'success' && data.value) {
  let poi: ApiPoi | undefined
  const deps = [] as ApiPoi[]
  let waypointIndex = 1

  data.value.features.forEach((f) => {
    const depID = 'metadata' in f.properties ? f.properties.metadata.id : f.properties.id
    mapStore.addSelectedFeatureDepsIDs(depID)

    f = {
      ...f,
      properties: {
        ...f.properties,
        vido_visible: true,
      },
    }

    if (poiId.value === depID) {
      poi = f as ApiPoi
    }

    if (f.properties['route:point:type']) {
      if (!('metadata' in f.properties)) {
        f = apiRouteWaypointToApiPoi(
          f as ApiRouteWaypoint,
          poi?.properties.display?.color_fill || '#76009E',
          poi?.properties.display?.color_line || '#76009E',
          f.properties['route:point:type'] === ApiRouteWaypointType.way_point
            ? (waypointIndex++).toString()
            : undefined,
        )
      }
      else {
        f = {
          ...f,
          properties: {
            ...f.properties,
            display: {
              icon: iconMap[f.properties['route:point:type']],
              color_fill: f.properties.display?.color_fill || poi?.properties.display?.color_fill || '#76009E',
              color_line: f.properties.display?.color_line || poi?.properties.display?.color_line || '#76009E',
              text: f.properties['route:point:type']
              === ApiRouteWaypointType.way_point
                ? (waypointIndex++).toString()
                : undefined,
            },
            editorial: {
              ...f.properties.editorial,
              'website:details': undefined,
            },
          },
        }
      }
    }

    deps.push(f as ApiPoi)
  })

  if (poi) {
    mapStore.setSelectedFeature(poi)

    // In case user click on vecto element, attach Pin Marker to POI Marker
    teritorioCluster.value?.setSelectedFeature(poi as unknown as MapGeoJSONFeature)

    if (poi.properties.metadata.category_ids?.length)
      menuStore.filterByDeps(poi.properties.metadata.category_ids, deps)
  }
}
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
      v-else
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
