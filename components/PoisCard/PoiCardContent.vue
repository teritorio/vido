<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { storeToRefs } from 'pinia'
import Fields from '~/components/PoisCard/Fields.vue'
import FavoriteIcon from '~/components/UI/FavoriteIcon.vue'
import TeritorioIcon from '~/components/UI/TeritorioIcon.vue'
import type { ApiPoi } from '~/lib/apiPois'
import { coordinatesHref } from '~/lib/coordinates'
import { favoriteStore as useFavoriteStore } from '~/stores/favorite'
import { mapStore as useMapStore } from '~/stores/map'
import { useSiteStore } from '~/stores/site'
import ContribFieldGroup from '~/components/Fields/ContribFieldGroup.vue'
import useDevice from '~/composables/useDevice'
import IsochroneTrigger from '~/components/Isochrone/IsochroneTrigger.vue'
import { getContrastedColors } from '~/composables/useFeature'

//
// Props
//
const props = withDefaults(defineProps<{
  detailsIsExternal?: boolean
  poi: ApiPoi
  showActions?: boolean
}>(), {
  detailsIsExternal: false,
  showActions: true,
})

//
// Emits
//
const emit = defineEmits<{
  (e: 'favoriteClick', poi: ApiPoi): void
  (e: 'exploreClick', poi: ApiPoi): void
  (e: 'zoomClick', poi: ApiPoi): void
}>()

//
// Composables
//
const { t } = useI18n()
const { $tracking } = useNuxtApp()
const { favoritesIds, favoriteAddresses } = storeToRefs(useFavoriteStore())
const { contribMode, isContribEligible, getContributorFields } = useContrib()
const { isModeExplorer } = storeToRefs(useMapStore())
const device = useDevice()
const { enabled: isochroneEnabled, isochroneCurrentFeature } = useIsochrone()
const { featureName, featureCategoryName } = useFeature(toRef(() => props.poi), { type: 'popup' })
const { explorerModeEnabled, favoritesModeEnabled } = storeToRefs(useSiteStore())

if (!props.poi.properties.display)
  throw createError(`Feature ${props.poi.properties.metadata.id} is missing 'display' property.`)

const { colorFill, colorText } = getContrastedColors(props.poi.properties.display.color_fill, props.poi.properties.display.color_text)

//
// Data
//
const routeHref = ref<string>()

//
// Hooks
//
onMounted(() => {
  routeHref.value = coordinatesHref(props.poi.geometry)
})

//
// Computed
//
const id = computed(() => {
  return props.poi.properties.metadata.id
})

const isSameFeatureAsIsochrone = computed(() => isochroneCurrentFeature.value?.properties?.metadata.id === id.value)

const isFavorite = computed(() => {
  return favoritesIds.value.includes(id.value) || favoriteAddresses.value.has(id.value.toString())
})

const colorLine = computed(() => {
  return props.poi.properties.display?.color_line || '#000000'
})

const icon = computed(() => {
  return props.poi.properties.display?.icon
})

const description = computed(() => {
  return props.poi.properties.description
})

const unavoidable = computed(() => {
  return Boolean(props.poi.properties.editorial?.unavoidable)
})

const websiteDetails = computed(() => {
  const url = props.poi.properties.editorial && props.poi.properties.editorial['website:details']

  if (!url) {
    return undefined
  }
  else if (!url.startsWith('https://') && !url.startsWith('http://')) {
    return url
  }
  else {
    const u = new URL(url)
    if (process.client && u.hostname !== window.location.hostname) {
      return url
    }
    else {
      return url.replace(
        `${u.protocol}//${u.hostname}${u.port ? `:${u.port}` : ''}`,
        '',
      )
    }
  }
})

//
// Methods
//
function onZoomClick() {
  trackingPopupEvent('zoom')
  emit('zoomClick', props.poi)
}

function onExploreClick() {
  if (!isModeExplorer.value)
    trackingPopupEvent('explore')

  emit('exploreClick', props.poi)
}

function onFavoriteClick() {
  if (!isFavorite.value)
    trackingPopupEvent('favorite')

  emit('favoriteClick', props.poi)
}

function trackingPopupEvent(event: 'details' | 'route' | 'explore' | 'favorite' | 'zoom' | 'isochrone') {
  $tracking({
    type: 'popup_event',
    event,
    poiId: id.value,
    category: featureCategoryName.value || '',
    title: featureName.value,
  })
}

function trackIsochroneEvent(profile: Profile) {
  $tracking({
    type: 'isochrone_event',
    event: 'select_profile',
    profile,
  })
}
</script>

<template>
  <div>
    <div class="tw-flex tw-items-center tw-justify-between tw-shrink-0">
      <h2
        v-if="featureName"
        class="tw-block tw-text-xl tw-font-semibold tw-leading-tight"
        :style="{
          color: colorLine,
        }"
      >
        {{ featureName }}
      </h2>

      <client-only>
        <template v-if="websiteDetails !== undefined">
          <NuxtLink
            v-if="
              !websiteDetails.startsWith('https://')
                && !websiteDetails.startsWith('http://')
            "
            class="tw-ml-6 tw-px-3 tw-py-1.5 tw-text-xs tw-text-zinc-800 tw-bg-zinc-100 hover:tw-bg-zinc-200 focus:tw-bg-zinc-200 tw-transition tw-transition-colors tw-rounded-md"
            :to="websiteDetails"
            :style="{
              background: colorFill,
              color: colorText,
            }"
            rel="noopener noreferrer"
            :target="detailsIsExternal ? '_blank' : '_self'"
            @click.stop="trackingPopupEvent('details')"
          >
            {{ t('poiCard.details') }}
          </NuxtLink>
          <a
            v-else
            class="tw-ml-6 tw-px-3 tw-py-1.5 tw-text-xs tw-text-zinc-800 tw-bg-zinc-100 hover:tw-bg-zinc-200 focus:tw-bg-zinc-200 tw-transition tw-transition-colors tw-rounded-md"
            :href="websiteDetails"
            :style="{
              background: colorFill,
              color: colorText,
            }"
            rel="noopener noreferrer"
            :target="detailsIsExternal ? '_blank' : '_self'"
            @click.stop="trackingPopupEvent('details')"
          >
            {{ t('poiCard.details') }}
          </a>
        </template>
      </client-only>
    </div>

    <div
      v-if="!unavoidable"
      class="tw-flex tw-items-center tw-mt-2 tw-text-sm tw-text-zinc-500 tw-shrink-0"
    >
      <TeritorioIcon
        v-if="icon"
        :color-text="colorLine"
        class="tw-mr-2"
        :picto="icon"
        :use-native-alignment="false"
      />

      {{ featureCategoryName }}
    </div>

    <p
      v-if="unavoidable && Boolean(description)"
      class="tw-text-sm tw-flex-grow tw-shrink-0 tw-mt-6"
    >
      {{ description }}
    </p>

    <div v-else class="tw-h-auto tw-flex-grow tw-shrink-0">
      <Fields
        :fields="
          (poi.properties.editorial && poi.properties.editorial.popup_fields)
            || []
        "
        :properties="poi.properties"
        :details="websiteDetails"
        :geom="poi.geometry"
        class="tw-mt-6 tw-text-sm"
        @click-detail="trackingPopupEvent('details')"
      />
      <ContribFieldGroup v-if="contribMode && isContribEligible(poi.properties)" v-bind="getContributorFields(poi)" />
    </div>

    <div v-if="showActions" class="tw-flex tw-items-center tw-space-x-2 tw-justify-evenly tw-shrink-0 tw-bottom-0 tw-pt-2">
      <a
        v-if="device.phone && routeHref"
        :href="routeHref"
        class="tw-flex tw-flex-col tw-items-center tw-flex-1 tw-h-full tw-p-2 tw-space-y-2 tw-rounded-lg hover:tw-bg-zinc-100"
        :title="t('poiCard.findRoute')"
        @click="trackingPopupEvent('route')"
      >
        <FontAwesomeIcon icon="route" :color="colorLine" size="sm" />
        <span class="tw-text-sm">{{ t('poiCard.route') }}</span>
      </a>

      <IsochroneTrigger
        v-if="isochroneEnabled && !device.smallScreen"
        class="tw-flex tw-flex-col tw-items-center tw-flex-1 tw-h-full tw-p-2 tw-space-y-2 tw-rounded-lg"
        :feature="poi"
        :class="[
          isSameFeatureAsIsochrone && 'tw-bg-blue-600 tw-text-white hover:tw-bg-blue-500',
          !isSameFeatureAsIsochrone && 'hover:tw-bg-zinc-100',
        ]"
        @trigger-click="trackingPopupEvent('isochrone')"
        @profile-update="trackIsochroneEvent"
      >
        <FontAwesomeIcon :color="isSameFeatureAsIsochrone ? '#ffffff' : colorLine" icon="clock" size="sm" />
        <span class="tw-text-sm">{{ t('isochrone.trigger.label') }}</span>
      </IsochroneTrigger>

      <button
        type="button"
        class="tw-flex tw-flex-1 tw-flex-col tw-items-center tw-space-y-2 tw-rounded-lg tw-p-2 tw-h-full hover:tw-bg-zinc-100"
        :title="t('poiCard.zoom')"
        @click.stop="onZoomClick"
      >
        <FontAwesomeIcon icon="plus" :color="colorLine" size="sm" />
        <span class="tw-text-sm">{{ t('poiCard.zoom') }}</span>
      </button>

      <button
        v-if="explorerModeEnabled"
        type="button"
        class="tw-flex tw-flex-1 tw-flex-col tw-items-center tw-space-y-2 tw-rounded-lg tw-p-2 tw-h-full"
        :class="[
          isModeExplorer && 'tw-bg-blue-600 tw-text-white hover:tw-bg-blue-500',
          !isModeExplorer && 'hover:tw-bg-zinc-100',
        ]"
        :title="isModeExplorer ? t('poiCard.unactivateExplore') : t('poiCard.activateExplore')"
        @click.stop="onExploreClick"
      >
        <FontAwesomeIcon
          icon="eye"
          :color="isModeExplorer ? '#ffffff' : colorLine"
          size="sm"
        />
        <span class="tw-text-sm">{{ t('poiCard.explore') }}</span>
      </button>

      <button
        v-if="favoritesModeEnabled && id"
        type="button"
        class="tw-flex tw-flex-col tw-items-center tw-flex-1 tw-h-full tw-p-2 tw-space-y-2 tw-rounded-lg hover:tw-bg-zinc-100"
        :title="isFavorite ? t('poiCard.favoriteOn') : t('poiCard.favoriteOff')"
        @click.stop="onFavoriteClick"
      >
        <FavoriteIcon :is-active="isFavorite" :color-line="colorLine" />
        <span class="tw-text-sm">{{ t('poiCard.favorite') }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
button {
  @apply focus:tw-outline-none;
}
</style>
