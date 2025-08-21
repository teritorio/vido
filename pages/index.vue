<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { GeoJSON, MultiPolygon, Polygon } from 'geojson'
import type { MapGeoJSONFeature } from 'maplibre-gl'
import type { ApiPoi, ApiPoiProperties } from '~/lib/apiPois'
import { type ApiPoiDeps, type ApiRouteWaypoint, ApiRouteWaypointType, iconMap, prepareApiPoiDeps } from '~/lib/apiPoiDeps'
import Home from '~/components/Home/Home.vue'
import { useSiteStore } from '~/stores/site'
import { menuStore as useMenuStore } from '~/stores/menu'
import { mapStore as useMapStore } from '~/stores/map'
import { regexForCategoryIds } from '~/composables/useIdsResolver'

const siteStore = useSiteStore()
const { config, settings } = storeToRefs(siteStore)

if (!config.value)
  throw createError({ statusCode: 500, statusMessage: 'Wrong config', fatal: true })

const route = useRoute()
const mapStore = useMapStore()
const { API_ENDPOINT, API_PROJECT, API_THEME } = config.value
const { $trackingInit } = useNuxtApp()

const boundaryGeojson = ref<Polygon | MultiPolygon>()
const poiId = ref<string>()
const categoryIds = ref<number[]>([])

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

  match.input?.split(',')
    .map(id => categoryIds.value.push(Number.parseInt(id)))
}

// Get POI ID from URL
if (categoryIds.value.length === 1 && route.name === 'index-p1' && !route.path.endsWith('/')) {
  poiId.value = route.params.p1?.toString()
  categoryIds.value = []
}

if (route.params.poiId) {
  poiId.value = route.params.poiId.toString()
}

const menuStore = useMenuStore()
const { apiMenuCategory, selectedCategoryIds } = storeToRefs(menuStore)
onBeforeMount(() => {
  $trackingInit(config.value!)
})

if (categoryIds.value.length) {
  menuStore.setSelectedCategoryIds(categoryIds.value)
}
else {
  categoryIds.value = []

  if (apiMenuCategory.value) {
    apiMenuCategory.value.forEach((category) => {
      if (category.selected_by_default)
        categoryIds.value.push(category.id)
    })
  }

  menuStore.setSelectedCategoryIds(categoryIds.value)
}

const { teritorioCluster } = storeToRefs(mapStore)
const { data, error, status } = await useAsyncData('features', async () => {
  await menuStore.fetchFeatures({
    vidoConfig: config.value!,
    categoryIds: categoryIds.value || [],
    clipingPolygonSlug: route.query.clipingPolygonSlug?.toString(),
  })

  let initialFeature: ApiPoiDeps | undefined
  if (poiId.value && !poiId.value.includes('_')) {
    initialFeature = await $fetch<ApiPoiDeps>(`${API_ENDPOINT}/${API_PROJECT}/${API_THEME}/poi/${poiId.value}/deps.geojson`, {
      query: {
        geometry_as: 'point',
        short_description: true,
      },
    })
  }

  return initialFeature
})

if (error.value)
  throw createError(error.value)

if (status.value === 'success' && data.value) {
  let poi: ApiPoi
  let waypointIndex = 1
  let waypoints: ApiRouteWaypoint[] = []
  let pois: ApiPoi[] = []
  let deps: ApiPoi[] = []
  const isRefPoiId = Number.isNaN(Number(poiId.value))

  if (isRefPoiId && poiId.value) {
    const refSplit = poiId.value.split(':')
    const idValue = refSplit.pop()
    const key = refSplit.join(':')
    poi = data.value.features.find(f => (f.properties as ApiPoiProperties)[key] === idValue) as ApiPoi
  }
  else {
    poi = data.value.features.find(f => (f.properties.metadata.id === Number(poiId.value))) as ApiPoi
  }

  if (!poi)
    throw createError(`Feature with ID: ${poiId.value} not found.`)

  if (poi.properties.metadata.dep_ids) {
    const featureReordered = prepareApiPoiDeps(
      data.value.features,
      poi.properties.metadata.dep_ids,
    )

    waypoints = featureReordered.waypoints
    pois = featureReordered.pois

    deps.push(...pois)

    waypoints.forEach((w) => {
      const { colorFill, colorText } = useContrastedColors(
        poi.properties.display?.color_fill || '#76009E',
        poi.properties.display?.color_text,
      )

      const formattedWaypoint = {
        ...w,
        properties: {
          ...w.properties,
          display: {
            icon: iconMap[w.properties['route:point:type']],
            color_fill: colorFill.value,
            color_line: poi.properties.display?.color_line || '#76009E',
            color_text: colorText.value,
            text: w.properties['route:point:type']
            === ApiRouteWaypointType.way_point
              ? waypointIndex.toString()
              : undefined,
          },
          editorial: {
            'website:details': undefined,
          },
        },
      } as ApiPoi

      if (w.properties['route:point:type'] === ApiRouteWaypointType.way_point)
        waypointIndex++

      deps.push(formattedWaypoint)
    })
  }
  else {
    deps.push(poi)
  }

  deps = deps.map((d) => {
    mapStore.addSelectedFeatureDepsIDs(d.properties.metadata.id)

    return {
      ...d,
      properties: {
        ...d.properties,
        vido_visible: true,
      },
    }
  })

  mapStore.setSelectedFeature(poi)

  // In case user click on vecto element, attach Pin Marker to POI Marker
  teritorioCluster.value?.setSelectedFeature(poi as unknown as MapGeoJSONFeature)

  if (selectedCategoryIds.value.length) {
    const currentCategory = selectedCategoryIds.value.find(id => poi.properties.metadata.category_ids?.includes(id))

    if (poi.properties.metadata.category_ids?.length && currentCategory) {
      menuStore.filterByDeps(currentCategory, deps)
      if (deps.length > 1)
        mapStore.setIsDepsView(true)
      else
        mapStore.setIsDepsView(false)
    }
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
