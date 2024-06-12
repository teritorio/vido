<script setup lang="ts">
import { groupBy } from 'lodash'
import { storeToRefs } from 'pinia'
import PoiDetails from '~/components/PoisDetails/PoiDetails.vue'
import type { ApiPoiDeps } from '~/lib/apiPoiDeps'
import { getPoiDepsById } from '~/lib/apiPoiDeps'
import type { ApiPoi } from '~/lib/apiPois'
import { headerFromSettings } from '~/lib/apiSettings'
import { getAsyncDataOrThrows } from '~/lib/getAsyncData'
import { siteStore as useSiteStore } from '~/stores/site'

definePageMeta({
  validate({ params }) {
    return (
      typeof params.id === 'string' && /^[-\w:]+$/.test(params.id)
    )
  },
})

const params = useRoute().params
const siteStore = useSiteStore()
const { config, settings, contents } = storeToRefs(siteStore)

const fetchPoiPoiDeps = getAsyncDataOrThrows(
  `fetchPoiPoiDeps-${params.id}`,
  async () => {
    return await getPoiDepsById(config.value!, params.id as string, {
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

if (!poiPoiDeps.value?.poi) {
  showError({
    statusCode: 404,
    statusMessage: 'POI not found. Missing main object.',
  })
}

const poi = ref<ApiPoi>(poiPoiDeps.value.poi!)
const poiDeps = ref<ApiPoiDeps>(poiPoiDeps.value.poiDeps)

const { $trackingInit } = useNuxtApp()
onBeforeMount(() => {
  $trackingInit(config.value!)
})

useHead(
  headerFromSettings(settings.value!, {
    // @ts-expect-error: Fix typings
    title: poiPoiDeps.value?.poi.properties.name,
    description: {
      // @ts-expect-error: Fix typings
      fr: poiPoiDeps.value?.poi.properties.description,
    },
  }),
)
</script>

<template>
  <PoiDetails
    v-if="settings"
    :settings="settings"
    :nav-menu-entries="contents!"
    :poi="poi"
    :poi-deps="poiDeps"
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
