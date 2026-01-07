<script setup lang="ts">
import { storeToRefs } from 'pinia'
import MapPois from '~/components/Map/MapPois.vue'
import type { ApiPoi, ApiPoiCollection } from '~/types/api/poi'
import { useSiteStore } from '~/stores/site'
import { regexForCategoryIds } from '~/composables/useIdsResolver'
import type { Poi } from '~/types/local/poi'
import { menuStore as useMenuStore } from '~/stores/menu'

definePageMeta({
  validate({ params }) {
    return !!params.ids && regexForCategoryIds.test(params.ids.toString())
  },
})

const { settings } = storeToRefs(useSiteStore())
const { $trackingInit } = useNuxtApp()
const route = useRoute()
const apiEndpoint = useState('api-endpoint')
const poiCompo = usePoi()
const menuStore = useMenuStore()

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

const { data, error } = await useFetch(
  `${apiEndpoint.value}/pois.geojson`,
  {
    query: {
      ids: poiIds.value.join(','),
      geometry_as: undefined,
      short_description: true,
      cliping_polygon_slug: clipingPolygonSlug.value,
    },
    transform: (data: ApiPoiCollection) => transformApiPoiCollection(data),
  },
)

if (error.value) {
  throw createError(error.value)
}

if (!data.value?.length) {
  throw createError({
    statusCode: 404,
    statusMessage: `POIS ${poiIds.value} data not found`,
  })
}

const features = computed(() => data.value ?? [])

onBeforeMount(() => {
  $trackingInit()
})

function transformApiPoiCollection(data: ApiPoiCollection): Poi[] {
  return data.features.map((feature: ApiPoi) => {
    const catId = feature.properties.metadata.category_ids?.[0]

    if (!catId)
      throw createError(`Category ID not found for feature ${feature.properties.metadata.id}.`)

    const category = menuStore.getCurrentCategory(catId)

    if (!category)
      throw createError(`Category ${catId} not found.`)

    return poiCompo.formatPoi(feature, category)
  })
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
    <MapPois
      :extra-attributions="settings!.attributions"
      :features="features"
      :feature-ids="poiIdsAsNumbers"
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

:deep(#map-container) {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>
