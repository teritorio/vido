<script setup lang="ts">
import { captureMessage } from '@sentry/nuxt'
import { storeToRefs } from 'pinia'
import MapPois from '~/components/Map/MapPois.vue'
import type { ApiPoi, ApiPoiCollection } from '~/types/api/poi'
import type { ApiPoiDepsCollection } from '~/types/api/poi-deps'
import type { PoiUnion } from '~/types/local/poi-deps'
import { useSiteStore } from '~/stores/site'
import { regexForCategoryIds } from '~/composables/useIdsResolver'
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
const poiDepsCompo = usePoiDeps()
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

const { data, error } = await useAsyncData('pois-map', async () => {
  const poisCollection = await $fetch<ApiPoiCollection>(
    `${apiEndpoint.value}/pois.geojson`,
    {
      query: {
        ids: poiIds.value.join(','),
        geometry_as: 'point',
        short_description: true,
        cliping_polygon_slug: clipingPolygonSlug.value,
      },
    },
  )

  const depsResults = await Promise.allSettled(
    poiIdsAsNumbers.value.map(poiId =>
      $fetch<ApiPoiDepsCollection>(
        `${apiEndpoint.value}/poi/${poiId}/deps.geojson`,
        {
          query: {
            geometry_as: 'point',
            short_description: true,
          },
        },
      ),
    ),
  )

  return { poisCollection, depsResults }
}, {
  transform: ({ poisCollection, depsResults }) => {
    const mainPoiIds = new Set(poiIdsAsNumbers.value)

    const mainPois = poisCollection.features.map((feature: ApiPoi) => {
      const catId = feature.properties.metadata.category_ids?.[0]

      if (!catId)
        throw createError(`Category ID not found for feature ${feature.properties.metadata.id}.`)

      const category = menuStore.getCurrentCategory(catId)

      if (!category)
        throw createError(`Category ${catId} not found.`)

      return poiCompo.formatPoi(feature, category)
    })

    const deps = depsResults.flatMap((result, index) => {
      if (result.status === 'rejected') {
        captureMessage(`Failed to fetch deps for POI ${poiIdsAsNumbers.value[index]}: ${result.reason}`, 'warning')
        return []
      }

      if (!result.value.features?.length)
        return []

      return poiDepsCompo.formatPoiDepsCollection(result.value, poiIdsAsNumbers.value[index])
    }).filter(dep => !mainPoiIds.has(dep.properties.metadata.id))

    return [...mainPois, ...deps]
  },
})

if (error.value) {
  throw createError(error.value)
}

if (!data.value?.length) {
  throw createError({
    statusCode: 404,
    statusMessage: `POIS ${poiIds.value} data not found`,
  })
}

const features = computed<PoiUnion[]>(() => data.value ?? [])

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
