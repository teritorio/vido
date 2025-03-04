<script setup lang="ts">
import { groupBy } from 'lodash'
import { storeToRefs } from 'pinia'
import PoiDetails from '~/components/PoisDetails/PoiDetails.vue'
import type { ApiPoiDeps } from '~/lib/apiPoiDeps'
import { getPoiDepsById } from '~/lib/apiPoiDeps'
import type { ApiPoi } from '~/lib/apiPois'
import { headerFromSettings } from '~/lib/apiSettings'
import { getAsyncDataOrThrows } from '~/lib/getAsyncData'
import { useSiteStore } from '~/stores/site'
import { regexForPOIIds } from '~/composables/useIdsResolver'

//
// Validators
//
definePageMeta({
  validate({ params }) {
    return !!params.id && regexForPOIIds.test(params.id.toString())
  },
})

//
// Composables
//
const siteStore = useSiteStore()
const { config, settings } = siteStore
const { articles } = storeToRefs(siteStore)
const { params } = useRoute()
const { $trackingInit } = useNuxtApp()

//
// Data
//
const poiDeps = ref<ApiPoiDeps>()

const fetchPoiPoiDeps = getAsyncDataOrThrows(
  `fetchPoiPoiDeps-${params.id}`,
  async () => {
    return await getPoiDepsById(config!, params.id as string, {
      geometry_as: 'point_or_bbox',
      short_description: false,
    }).then((poiDeps) => {
      let poi: ApiPoi | undefined
      if (poiDeps) {
        const g = groupBy(
          poiDeps.features,
          feature => 'metadata' in feature.properties
            ? feature.properties.metadata.id.toString() === params.id
            : false,
        )
        poi = g.true && (g.true[0] as ApiPoi)
        poiDeps.features = g.false || []
      }

      return { poi, poiDeps }
    })
  },
)

const [poiPoiDeps] = await Promise.all([fetchPoiPoiDeps])

if (!poiPoiDeps.value.poi) {
  throw createError({
    statusCode: 404,
    statusMessage: 'POI not found. Missing main object.',
  })
}

const poi = ref(poiPoiDeps.value.poi)
poiDeps.value = poiPoiDeps.value.poiDeps

const { featureSeoTitle } = useFeature(poi, { type: 'details' })

if (!featureSeoTitle.value)
  throw createError('Feature has no name')

//
// Hooks
//
onBeforeMount(() => {
  $trackingInit(config!)
})

useHead(
  headerFromSettings(settings!, {
    title: featureSeoTitle.value,
    description: {
      fr: poi.value?.properties.description,
    },
  }),
)
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
