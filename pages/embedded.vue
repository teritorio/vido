<script setup lang="ts">
import type { GeoJSON, MultiPolygon, Polygon } from 'geojson'
import { storeToRefs } from 'pinia'
import Embedded from '~/components/Home/Embedded.vue'
import { type ApiPoi, getPoiById } from '~/lib/apiPois'
import { headerFromSettings } from '~/lib/apiSettings'
import { siteStore as useSiteStore } from '~/stores/site'

//
// Data
//
const boundaryGeojson = ref<Polygon | MultiPolygon>()
const categoryIdsJoin = ref<string>()
const poiId = ref<string>()
const categoryIds = ref<number[]>()
const initialPoi = ref<ApiPoi>()

//
// Composables
//
const { params, query, path } = useRoute()
const siteStore = useSiteStore()
const { config, settings, translations } = storeToRefs(siteStore)
const { $settings, $propertyTranslations, $trackingInit } = useNuxtApp()

//
// Hooks
//
onBeforeMount(() => {
  $trackingInit(config.value!)
})

const { boundary } = query
if (boundary && typeof boundary === 'string' && settings.value!.polygons_extra) {
  const boundaryObject = settings.value!.polygons_extra[boundary]
  if (boundaryObject) {
    if (typeof boundaryObject.data === 'string') {
      const geojson = (await (await fetch(boundaryObject.data)).json()) as GeoJSON

      if (geojson.type === 'Feature')
        boundaryGeojson.value = geojson.geometry as Polygon | MultiPolygon
      else if (geojson.type === 'Polygon' || geojson.type === 'MultiPolygon')
        boundaryGeojson.value = geojson as Polygon | MultiPolygon
    }
    else {
      boundaryGeojson.value = boundaryObject.data as Polygon
    }
  }
}

// Workaround Nuxt missing feature to simple respect trialling slash meaning
if (params.poiId) {
  categoryIdsJoin.value = params.p1 as string
  poiId.value = params.poiId as string
}
else if (path.endsWith('/')) {
  categoryIdsJoin.value = params.p1 as string
  poiId.value = undefined
}
else {
  categoryIdsJoin.value = undefined
  poiId.value = params.p1 as string
}

if (categoryIdsJoin.value) {
  const stringIds = categoryIdsJoin.value.split(',')
  categoryIds.value = stringIds.map(id => Number.parseInt(id))
}

if (categoryIds.value && poiId.value) {
  const { data, error, pending } = useAsyncData<ApiPoi>(`fetchPoi-${poiId.value}`, () => getPoiById(config.value!, poiId.value!, { short_description: false }))

  if (error.value)
    throw createError(error.value)

  if (!pending.value && !data.value)
    throw createError({ statusCode: 404, message: 'Initial POI not found !' })

  initialPoi.value = data.value!
}

useHead(headerFromSettings(settings.value!))

$settings.set(settings.value!)
$propertyTranslations.set(translations.value!)
</script>

<template>
  <Embedded
    :initial-category-ids="categoryIds"
    :initial-poi="initialPoi || undefined"
    :boundary-area="boundaryGeojson"
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
