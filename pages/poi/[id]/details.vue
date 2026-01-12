<script setup lang="ts">
import { storeToRefs } from 'pinia'
import PoiDetails from '~/components/PoisDetails/PoiDetails.vue'
import type { ApiPoiDepsCollection } from '~/types/api/poi-deps'
import { headerFromSettings } from '~/lib/apiSettings'
import { useSiteStore } from '~/stores/site'
import { regexForPOIIds } from '~/composables/useIdsResolver'
import type { PoiUnion } from '~/types/local/poi-deps'
import type { Poi } from '~/types/local/poi'

definePageMeta({
  validate({ params }) {
    return !!params.id && regexForPOIIds.test(params.id.toString())
  },
})

const { articles, settings, theme } = storeToRefs(useSiteStore())
const { params } = useRoute()
const { $trackingInit } = useNuxtApp()
const apiEndpoint = useState('api-endpoint')
const poiDepsCompo = usePoiDeps()

const poi = ref<Poi>()
const poiDeps = ref<PoiUnion[]>()
const poiId = computed(() => Number.parseInt(params.id.toString()))

const { data, error, status } = await useFetch(
  `${apiEndpoint.value}/poi/${params.id}/deps.geojson`,
  {
    key: `poi-${params.id}`,
    query: {
      geometry_as: 'point_or_bbox',
      short_description: false,
    },
    transform: (data: ApiPoiDepsCollection) => {
      poiDepsCompo.resetWaypointIndex()

      return poiDepsCompo.formatPoiDepsCollection(data, poiId.value, 'fr-FR')
    },
  },
)

if (error.value) {
  throw createError(error.value)
}

if (status.value === 'success' && data.value) {
  poi.value = data.value.find(feature => feature.properties.metadata.id === poiId.value) as Poi
  poiDeps.value = data.value.filter(feature => feature.properties.metadata.id !== poiId.value) as PoiUnion[]
}

if (!poi.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `Poi ${poiId.value} not found.`,
  })
}

const { featureSeoTitle } = useFeature(toRef(poi.value), { type: 'details' })

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
          fr: poi.value?.properties.description?.['fr-FR'].value,
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
    <PoiDetails
      v-if="settings && poi"
      :settings="settings"
      :nav-menu-entries="articles!"
      :poi="poi"
      :poi-deps="poiDeps"
      :page-title="featureSeoTitle!"
      class="page-details tw-overflow-clip"
    />
  </VApp>
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
