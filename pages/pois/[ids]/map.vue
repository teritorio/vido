<script setup lang="ts">
import { storeToRefs } from 'pinia'
import MapPois from '~/components/Map/MapPois.vue'
import { type ApiPoiId, type ApiPois, getPois } from '~/lib/apiPois'
import { type Settings, getSettings, headerFromSettings } from '~/lib/apiSettings'
import { getAsyncDataOrThrows } from '~/lib/getAsyncData'
import { vidoConfig } from '~/plugins/vido-config'
import { siteStore } from '~/stores/site'
import type { VidoConfig } from '~/utils/types-config'

definePageMeta({
  validate({ params }) {
    return (
      typeof params.ids === 'string'
      && /^[-\w:,]+$/.test(params.ids)
    )
  },
})

const params = useRoute().params
const configRef = await getAsyncDataOrThrows('configRef', () =>
  Promise.resolve(siteStore().config || vidoConfig(useRequestHeaders())))
const config: VidoConfig = configRef.value

const fetchSettings = getAsyncDataOrThrows('fetchSettings', () =>
  siteStore().settings
    ? Promise.resolve(siteStore().settings as Settings)
    : getSettings(config))

let settings: Ref<Settings>
let pois: Ref<ApiPois | null>

if (params.ids) {
  const ids = (params.ids as string).split(',')
  const getPoiPromise = getAsyncDataOrThrows('getPoiPromise', async () =>
    await getPois(config, ids, {
      geometry_as: undefined,
    }))
  const [settingsF, poisF] = await Promise.all([
    fetchSettings,
    getPoiPromise,
  ])

  settings = settingsF
  pois = poisF
}
else {
  const [settingsF] = await Promise.all([fetchSettings])

  settings = settingsF
  pois = ref(null)
}

const ids = computed((): ApiPoiId[] => {
  return pois.value?.features.map(feature => feature.properties.metadata.id) || []
})

const { $trackingInit, $vidoConfigSet } = useNuxtApp()
onBeforeMount(() => {
  $trackingInit(config)
  $vidoConfigSet(config)
})

const {
  locale,
  config: globalConfig,
  settings: globalSettings,
} = storeToRefs(siteStore())

const { locale: i18nLocale } = useI18n()
onMounted(() => {
  locale.value = i18nLocale.value
})

globalConfig.value = config
globalSettings.value = settings.value

const { $settings } = useNuxtApp()
$settings.set(settings.value)

useHead(headerFromSettings(settings.value))
</script>

<template>
  <div class="tw-flex tw-flex-col tw-w-full tw-h-full">
    <MapPois
      :extra-attributions="settings.attributions"
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
