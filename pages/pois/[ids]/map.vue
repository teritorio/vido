<script setup lang="ts">
import { storeToRefs } from 'pinia'
import MapPois from '~/components/Map/MapPois.vue'
import type { ApiPoiCollection } from '~/types/api/poi'
import { useSiteStore } from '~/stores/site'
import { regexForCategoryIds } from '~/composables/useIdsResolver'

definePageMeta({
  validate({ params }) {
    return !!params.ids && regexForCategoryIds.test(params.ids.toString())
  },
})

const { settings } = storeToRefs(useSiteStore())
const { $trackingInit } = useNuxtApp()
const route = useRoute()
const apiEndpoint = useState('api-endpoint')

const poiIds = computed(() => {
  const param = route.params.ids

  if (Array.isArray(param)) {
    return param
  }
  else if (typeof param === 'string') {
    return param ? param.split(',') : []
  }

  return [] as string[]
})

const poiIdsAsNumbers = computed(() => poiIds.value.map(id => Number(id)))

const clipingPolygonSlug = computed(() => route.query.clipingPolygonSlug?.toString())

const { data, error } = await useFetch<ApiPoiCollection>(
  `${apiEndpoint.value}/pois.geojson`,
  {
    query: {
      ids: poiIds.value.join(','),
      geometry_as: undefined,
      short_description: true,
      cliping_polygon_slug: clipingPolygonSlug.value,
    },
  },
)

if (error.value) {
  throw createError({
    statusCode: 500,
    statusMessage: `Failed to fetch POI data: ${error.value.message}`,
  })
}

if (!data.value || !data.value.features.length) {
  throw createError({
    statusCode: 404,
    statusMessage: `POIS ${poiIds.value} data not found`,
  })
}

const features = computed(() => data.value?.features ?? [])

onBeforeMount(() => {
  $trackingInit()
})
</script>

<template>
  <div class="tw-flex tw-flex-col tw-w-full tw-h-full">
    <MapPois
      :extra-attributions="settings!.attributions"
      :features="features"
      :feature-ids="poiIdsAsNumbers"
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
