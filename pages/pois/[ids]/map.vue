<script setup lang="ts">
import MapPois from '~/components/Map/MapPois.vue'
import { type ApiPoiId, type ApiPois, getPois } from '~/lib/apiPois'
import { getAsyncDataOrThrows } from '~/lib/getAsyncData'
import { useSiteStore } from '~/stores/site'
import { regexForCategoryIds } from '~/composables/useIdsResolver'

//
// Validators
//
definePageMeta({
  validate({ params }) {
    return !!params.ids && regexForCategoryIds.test(params.ids.toString())
  },
})

//
// Composables
//
const { params } = useRoute()
const siteStore = useSiteStore()
const { config, settings } = siteStore
const { $trackingInit } = useNuxtApp()
const route = useRoute()

//
// Data
//
const pois = ref<ApiPois>()

if (params.ids) {
  const ids = (params.ids as string).split(',')
  const query = {
    geometry_as: undefined,
  } as Record<string, any>

  if (route.query.clipingPolygonSlug)
    query.cliping_polygon_slug = route.query.clipingPolygonSlug.toString()

  const getPoiPromise = getAsyncDataOrThrows('getPoiPromise', async () => await getPois(config!, ids, query))
  const [poisF] = await Promise.all([getPoiPromise])
  pois.value = poisF.value
}
else {
  pois.value = undefined
}

//
// Computed
//
const ids = computed((): ApiPoiId[] => pois.value?.features.map(feature => feature.properties.metadata.id) || [])

//
// Hooks
//
onBeforeMount(() => {
  $trackingInit()
})
</script>

<template>
  <div class="tw-flex tw-flex-col tw-w-full tw-h-full">
    <MapPois
      :extra-attributions="settings!.attributions"
      :features="pois ? pois.features : []"
      :feature-ids="ids"
    />
  </div>
</template>

<style scoped>
/* stylelint-disable selector-id-pattern */
body,
#__nuxt,
#__layout {
  @apply tw-h-full tw-w-full tw-overflow-hidden tw-overscroll-none;
}

:deep(#map-container) {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>
