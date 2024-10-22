<script setup lang="ts">
import { storeToRefs } from 'pinia'
import MapPois from '~/components/Map/MapPois.vue'
import { type ApiPoiId, type ApiPois, getPois } from '~/lib/apiPois'
import { getAsyncDataOrThrows } from '~/lib/getAsyncData'
import { siteStore as useSiteStore } from '~/stores/site'

//
// Validators
//
definePageMeta({
  validate({ params }) {
    return (
      typeof params.ids === 'string'
      && /^[-\w:,]+$/.test(params.ids)
    )
  },
})

//
// Composables
//
const { params } = useRoute()
const siteStore = useSiteStore()
const { config, settings } = storeToRefs(siteStore)
const { $trackingInit } = useNuxtApp()
const route = useRoute()

//
// Data
//
const pois = ref<ApiPois>()

if (params.ids) {
  const ids = (params.ids as string).split(',')
  const getPoiPromise = getAsyncDataOrThrows('getPoiPromise', async () =>
    await getPois(config.value!, ids, {
      geometry_as: undefined,
      cliping_polygon_slug: route.query.clipingPolygonSlug?.toString(),
    }))
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
  $trackingInit(config.value!)
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
