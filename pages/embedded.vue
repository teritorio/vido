<script setup lang="ts">
import type { GeoJSON, MultiPolygon, Polygon } from 'geojson'
import { storeToRefs } from 'pinia'
import Embedded from '~/components/Home/Embedded.vue'
import { siteStore as useSiteStore } from '~/stores/site'

//
// Composables
//
const { params, query, path } = useRoute()
const siteStore = useSiteStore()
const { config, settings } = storeToRefs(siteStore)
const { $trackingInit } = useNuxtApp()

//
// Data
//
const boundaryGeojson = ref<Polygon | MultiPolygon>()
const categoryIdsJoin = ref<string>()
const poiId = ref<string>()
const categoryIds = ref<number[]>()

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

categoryIds.value = categoryIdsJoin.value?.split(',').map(id => Number.parseInt(id))
</script>

<template>
  <Embedded
    :boundary-area="boundaryGeojson"
    :initial-category-ids="categoryIds"
    :initial-poi="poiId"
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
