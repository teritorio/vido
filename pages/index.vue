<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { GeoJSON, MultiPolygon, Polygon } from 'geojson'
import type { GeoJSONFeature } from 'maplibre-gl'
import type { ApiPoi } from '~/types/api/poi'
import type { ApiPoiDepsCollection, ApiPoiUnion } from '~/types/api/poi-deps'
import { usePoiDeps } from '~/composables/usePoiDeps'
import Home from '~/components/Home/Home.vue'
import { type SiteInfosTheme, headerFromSettings } from '~/lib/apiSettings'
import { useSiteStore } from '~/stores/site'
import { menuStore as useMenuStore } from '~/stores/menu'
import { mapStore as useMapStore } from '~/stores/map'
import { regexForCategoryIds } from '~/composables/useIdsResolver'
import type { PoiUnion } from '~/types/local/poi-deps'

const { settings, theme } = storeToRefs(useSiteStore())
const apiEndpoint = useState('api-endpoint')

const route = useRoute()
const mapStore = useMapStore()
const { $trackingInit } = useNuxtApp()
const menuStore = useMenuStore()
const poiDepsCompo = usePoiDeps()
const { teritorioCluster } = storeToRefs(mapStore)
const { allFeatures, apiMenuCategory, selectedCategoryIds, selectedCategories } = storeToRefs(menuStore)

const mainPoi = ref<ApiPoi>()
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

const isSingleCategory = computed(() => categoryIds.value.length === 1)
const singleCategory = computed(() => isSingleCategory.value ? menuStore.getCurrentCategory(categoryIds.value[0]) : undefined)
const categoryFeatures = computed(() => isSingleCategory.value ? allFeatures.value[categoryIds.value[0]] ?? [] : [])
const namedCategoryFeatures = computed(() => categoryFeatures.value.filter(poi => poi.properties.name?.['fr-FR'] || poi.properties.name?.fr))

if (settings.value && theme.value) {
  useHead(() => headerFromSettings(
    theme.value as SiteInfosTheme,
    settings.value!.icon_font_css_url,
    {
      title: selectedCategories.value?.length === 1
        ? selectedCategories.value[0]?.category?.name?.fr
        : undefined,
    },
  ))
}

const { data, error, status } = await useAsyncData('features', async () => {
  await menuStore.fetchFeatures({
    apiEndpoint: apiEndpoint.value as string,
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

if (settings.value && theme.value && isSingleCategory.value && singleCategory.value) {
  const origin = useRequestURL().origin
  const categoryName = singleCategory.value.category.name.fr
  const themeTitle = theme.value.title?.fr ?? ''

  useHead(() => ({
    script: namedCategoryFeatures.value.length
      ? [
          {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              'name': `${categoryName} — ${themeTitle}`,
              'mainEntity': {
                '@type': 'ItemList',
                'itemListElement': namedCategoryFeatures.value.map((poi, index) => ({
                  '@type': 'ListItem',
                  'position': index + 1,
                  'url': `${origin}/poi/${poi.properties.metadata.id}/details`,
                })),
              },
            }),
          },
        ]
      : [],
  }))
}

if (status.value === 'success' && data.value && mainPoi.value) {
  poiDepsCompo.processPoiDeps(data.value, mainPoi.value.properties.metadata.id, selectedCategoryIds.value)
  teritorioCluster.value?.setSelectedFeature(mainPoi.value as unknown as GeoJSONFeature)
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

  if (!data || !poiId.value)
    return undefined

  mainPoi.value = getMainPoi(data.features)

  return poiDepsCompo.formatPoiDepsCollection(data, mainPoi.value.properties.metadata.id)
}

onBeforeMount(() => {
  $trackingInit()
})
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
    <template v-else>
      <Home
        :boundary-area="boundaryGeojson"
        :initial-category-ids="categoryIds"
      />
      <ul v-if="isSingleCategory && namedCategoryFeatures.length" class="tw-sr-only">
        <li v-for="poi in namedCategoryFeatures" :key="poi.properties.metadata.id">
          <a :href="`/poi/${poi.properties.metadata.id}/details`">
            {{ poi.properties.name?.['fr-FR'] || poi.properties.name?.fr }}
          </a>
        </li>
      </ul>
    </template>
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
