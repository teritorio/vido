<script setup lang="ts">
import { groupBy } from 'lodash'
import { storeToRefs } from 'pinia'
import PoiDetails from '~/components/PoisDetails/PoiDetails.vue'
import type { ApiPoiDeps } from '~/lib/apiPoiDeps'
import type { ApiPoi } from '~/lib/apiPois'
import { headerFromSettings } from '~/lib/apiSettings'
import { useSiteStore } from '~/stores/site'
import { regexForPOIIds } from '~/composables/useIdsResolver'

interface PoiPageData {
  poi?: ApiPoi
  poiDeps?: ApiPoiDeps
}

definePageMeta({
  validate({ params }) {
    return !!params.id && regexForPOIIds.test(params.id.toString())
  },
})

const { articles, settings, theme } = storeToRefs(useSiteStore())
const { params } = useRoute()
const { $trackingInit } = useNuxtApp()
const apiEndpoint = useState('api-endpoint')

const { data, error } = await useFetch(
  `${apiEndpoint.value}/poi/${params.id}/deps.geojson`,
  {
    key: `poi-${params.id}`,
    query: {

      geometry_as: 'point_or_bbox',
      short_description: false,
    },
    transform: (response: ApiPoiDeps): PoiPageData => {
      if (!response?.features) {
        return { poi: undefined, poiDeps: undefined }
      }

      const { true: poiFeatures, false: otherFeatures } = groupBy(
        response.features,
        feature => 'metadata' in feature.properties
          ? feature.properties.metadata.id.toString() === params.id
          : false,
      )

      const poi = poiFeatures?.[0] as ApiPoi | undefined

      const poiDeps: ApiPoiDeps = {
        ...response,
        features: otherFeatures || [],
      }

      return { poi, poiDeps }
    },
  },
)

if (error.value) {
  throw createError({
    statusCode: 500,
    statusMessage: `Failed to fetch POI data: ${error.value.message}`,
  })
}

if (!data.value?.poi) {
  throw createError({
    statusCode: 404,
    statusMessage: `POI with ID: ${params.id} not found`,
  })
}

const poi = ref(data.value.poi)
const poiDeps = ref(data.value.poiDeps)
const { featureSeoTitle } = useFeature(poi as Ref<ApiPoi>, { type: 'details' })

if (!featureSeoTitle.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Feature has no name',
  })
}

if (settings.value && theme.value) {
  useHead(
    headerFromSettings(
      theme.value,
      settings.value.icon_font_css_url,
      {
        title: featureSeoTitle.value,
        description: {
          fr: poi.value?.properties.description?.['fr-FR'],
        },
      },
    ),
  )
}

onBeforeMount(() => {
  $trackingInit()
})
</script>

<template>
  <PoiDetails
    v-if="settings"
    :settings="settings"
    :nav-menu-entries="articles!"
    :poi="poi!"
    :poi-deps="poiDeps"
    :page-title="featureSeoTitle!"
    class="page-details tw-overflow-clip"
  />
</template>

<style lang="scss" scoped>
@import '~/assets/details';

.page-details {
  color: $color-text;
  background-color: #fefefe;
  padding: 1rem;
  min-width: 21rem;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizelegibility;
  line-height: 1.3;
  word-wrap: break-word;

  @extend %font-light;
}
</style>

<style>
/* stylelint-disable selector-id-pattern */
body,
#__nuxt,
#__layout {
  -webkit-print-color-adjust: exact;
}

img,
.poi-deck,
.poi-map,
#route-map {
  page-break-before: auto;
  page-break-after: auto;
  page-break-inside: avoid;
}
</style>
