<script setup lang="ts">
import type { GeoJSON, MultiPolygon, Polygon } from 'geojson'
import { useSiteStore } from '~/stores/site'
import { menuStore as useMenuStore } from '~/stores/menu'
import { mapStore as useMapStore } from '~/stores/map'
import type { ApiPoiDeps } from '~/lib/apiPoiDeps'
import type { ApiPoi } from '~/lib/apiPois'
import Home from '~/components/Home/Home.vue'

// definePageMeta({
//   validate: ({ params }) => {
//     const match = params.p1.toString().match(regexForCategoryIds)

//     if (match?.groups && (match.groups.cartocode || match.groups.reference || match.groups.osm)) {
//       return false
//     }

//     return !!params.p1 && !!params.poiId && regexForCategoryIds.test(params.p1.toString()) && regexForPOIIds.test(params.poiId.toString())
//   },
// })

// definePageMeta({
//   validate: ({ params, path }) => {
//     if (!params.p1)
//       return false

//     const p1Str = params.p1.toString()
//     const match = p1Str.match(regexForCategoryIds)

//     if (!match
//       || (path.endsWith('/')
//       && match.groups
//       && (match.groups.cartocode || match.groups.reference || match.groups.osm))
//     ) {
//       return false
//     }

//     return regexForCategoryIds.test(p1Str)
//   },
// })

const siteStore = useSiteStore()
const { config, settings } = siteStore

if (!config)
  throw createError({ statusCode: 500, statusMessage: 'Wrong config', fatal: true })

const route = useRoute()

const catIds = computed(() => {
  if (!route.params.catIds)
    return []

  return route.params.catIds.toString().split(',').map(Number)
})

const poiId = computed(() => {
  if (!route.params.poiId)
    return undefined

  return Number(route.params.poiId.toString())
})

const asyncKey = computed(() => {
  const { catIds, poiId } = route.params

  if (!catIds)
    return 'no-fetch'

  return poiId ? `map-${catIds}-${poiId}` : `map-${catIds}`
})

const isDirectPoi = computed(() => catIds.value.length === 1 && !poiId.value && !route.path.endsWith('/'))

const mapStore = useMapStore()
const menuStore = useMenuStore()
const { API_ENDPOINT, API_PROJECT, API_THEME } = config
const { data, pending, error } = useAsyncData<ApiPoiDeps>(
  asyncKey.value,
  async () => {
    if (!catIds.value)
      return {} as ApiPoiDeps

    if (isDirectPoi.value) {
      return await $fetch<ApiPoiDeps>(
        `${API_ENDPOINT}/${API_PROJECT}/${API_THEME}/poi/${catIds.value[0]}/deps.geojson`,
        {
          query: {
            geometry_as: 'point_or_bbox',
            short_description: false,
          },
        },
      )
    }

    await menuStore.fetchFeatures({
      vidoConfig: config,
      categoryIds: catIds.value,
      clipingPolygonSlug: route.query.clipingPolygonSlug?.toString(),
    })

    if (poiId.value) {
      let feature = menuStore.getFeatureById(poiId.value)

      if (!feature) {
        const poiDeps = await $fetch<ApiPoiDeps>(
        `${API_ENDPOINT}/${API_PROJECT}/${API_THEME}/poi/${poiId.value}/deps.geojson`,
        {
          query: {
            geometry_as: 'point_or_bbox',
            short_description: false,
          },
        },
        )

        feature = poiDeps.features.find((f) => {
          const id = 'metadata' in f.properties ? f.properties.metadata.id : f.properties.id
          return id === poiId.value
        }) as ApiPoi
      }

      await mapStore.setSelectedFeature(feature)
    }

    return {} as ApiPoiDeps
  },
)

const { $trackingInit } = useNuxtApp()
onBeforeMount(() => {
  $trackingInit(config)
})

watchEffect(() => {
  menuStore.setSelectedCategoryIds(catIds.value)

  if (isDirectPoi.value && data.value) {
    const feature = data.value.features.find((f) => {
      const id = 'metadata' in f.properties ? f.properties.metadata.id : f.properties.id
      return id === catIds.value[0]
    }) as ApiPoi

    if (!feature) {
      throw createError({ statusCode: 404, message: 'Feature not found' })
    }

    navigateTo({
      params: {
        catIds: feature.properties.metadata.category_ids?.join(','),
        poiId: catIds.value[0],
      },
    })
  }
})

const boundaryGeojson = ref<Polygon | MultiPolygon>()
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
</script>

<template>
  <div>
    <p v-if="pending">
      Loading...
    </p>
    <p v-else-if="error">
      {{ error }}
    </p>

    <VApp v-else>
      <Home :boundary-area="boundaryGeojson" />
    </VApp>
  </div>
</template>

<style scoped>
/* stylelint-disable selector-id-pattern */
body,
#__nuxt,
#__layout {
  @apply tw-h-full tw-w-full tw-overflow-hidden tw-overscroll-none;
}
</style>
