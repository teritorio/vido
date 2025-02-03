<script setup lang="ts">
import type { FitBoundsOptions, LngLatBounds } from 'maplibre-gl'
import type { MultiPolygon, Polygon } from 'geojson'
import { storeToRefs } from 'pinia'
import SelectedCategories from '~/components/Home/SelectedCategories.vue'
import MapFeatures from '~/components/MainMap/MapFeatures.vue'
import PoiCardContent from '~/components/PoisCard/PoiCardContent.vue'
import CategorySelector from '~/components/PoisList/CategorySelector.vue'
import UIButton from '~/components/UI/UIButton.vue'
import type { ApiPoi } from '~/lib/apiPois'
import type { ApiMenuCategory } from '~/lib/apiMenu'
import { getBBoxFeature } from '~/lib/bbox'
import { mapStore as useMapStore } from '~/stores/map'
import { menuStore as useMenuStore } from '~/stores/menu'
import { siteStore as useSiteStore } from '~/stores/site'
import { Mode } from '~/utils/types'
import { flattenFeatures } from '~/utils/utilities'
import IsochroneStatus from '~/components/Isochrone/IsochroneStatus.vue'

//
// Props
//
const props = defineProps<{
  boundaryArea?: Polygon | MultiPolygon
  initialCategoryIds?: number[]
}>()

//
// Composables
//
const mapStore = useMapStore()
const { isModeExplorer, mode, selectedFeature } = storeToRefs(mapStore)
const menuStore = useMenuStore()
const { apiMenuCategory, features, selectedCategoryIds, menuItems } = storeToRefs(menuStore)
const { config, settings } = useSiteStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { isochroneCurrentFeature } = useIsochrone()

//
// Data
//
const initialBbox = ref<LngLatBounds | null>(null)
const mapFeaturesRef = ref<InstanceType<typeof MapFeatures>>()

//
// Hooks
//
onMounted(() => {
  if (props.initialCategoryIds) {
    menuStore.setSelectedCategoryIds(props.initialCategoryIds)
  }
  else if (typeof location !== 'undefined') {
    const enabledCategories: ApiMenuCategory['id'][] = []
    if (apiMenuCategory.value) {
      apiMenuCategory.value.forEach((category) => {
        if (category.selected_by_default)
          enabledCategories.push(category.id)
      })
    }
    menuStore.setSelectedCategoryIds(enabledCategories)
  }

  if (props.boundaryArea) {
    initialBbox.value = getBBoxFeature(props.boundaryArea)
  }
  else {
    // @ts-expect-error: setting wrong type to initialBbox
    initialBbox.value = settings!.bbox_line.coordinates
  }
})

//
// Computed
//
const filters = computed(() => {
  return route.query.menuItemIds
    ? route.query.menuItemIds
      .toString()
      .split(',')
      .map(f => Number.parseInt(f))
    : undefined
})

const fitBoundsPaddingOptions = computed((): FitBoundsOptions['padding'] => {
  return {
    top: 100,
    bottom: 100,
    right: 100,
    left: 100,
  }
})

const isFiltersEqualToCategoryId = computed(() => {
  if (filters.value?.length === 1 && selectedCategoryIds.value.length === 1)
    return filters.value[0] === selectedCategoryIds.value[0]
  return false
})

const mapFeatures = computed((): ApiPoi[] => {
  return flattenFeatures(features.value)
})

const poiFilters = computed(() => {
  return (
    (
      isModeExplorer.value
      && (Object.values(apiMenuCategory.value || {})
        .map(c => c.category?.style_class)
        .filter(s => s !== undefined) as string[][])
    )
    || null
  )
})

//
// Watchers
//
watch(selectedFeature, () => {
  routerPushUrl()
})

watch(selectedCategoryIds, (a, b) => {
  if (a !== b) {
    routerPushUrl()
    if (selectedCategoryIds.value) {
      menuStore.fetchFeatures({
        vidoConfig: config!,
        categoryIds: selectedCategoryIds.value,
        clipingPolygonSlug: route.query.clipingPolygonSlug?.toString(),
      })
    }
  }
})

//
// Methods
//
function goToSelectedFeature() {
  if (mapFeaturesRef.value)
    mapFeaturesRef.value.goToSelectedFeature()
}

function onMenuChange(newCategoryId: number) {
  menuStore.addSelectedCategoryIds([newCategoryId])
}

function routerPushUrl() {
  const categoryIds = selectedCategoryIds.value.join(',')
  const id = selectedFeature.value?.properties?.metadata?.id?.toString()
    || selectedFeature.value?.id?.toString()
    || null
  router.push({
    path: `/embedded${categoryIds ? `/${categoryIds}/` : '/'}${id ? `${id}` : ''}`,
    query: router.currentRoute.value.query,
    hash: router.currentRoute.value.hash,
  })
}

function toggleExploreAroundSelectedPoi() {
  if (!isModeExplorer.value) {
    mode.value = Mode.EXPLORER
    goToSelectedFeature()
  }
  else {
    mode.value = Mode.BROWSER
  }
}
</script>

<template>
  <div class="tw-flex tw-h-screen tw-flex-col-reverse md:tw-flex-row md:tw-w-screen">
    <div
      v-if="selectedFeature"
      class="tw-h-screen tw-p-4 tw-bg-white tw-z-20 tw-absolute tw-w-screen md:tw-relative md:tw-w-1/3 md:tw-max-w-md tw-overflow-scroll"
    >
      <div class="tw-grid tw-justify-items-end tw-pb-4">
        <UIButton
          :label="t('ui.close')"
          icon="times"
          @click="mapStore.setSelectedFeature(null)"
        />
      </div>
      <PoiCardContent
        :details-is-external="true"
        :poi="selectedFeature"
        :favorites-mode-enabled="false"
        @explore-click="toggleExploreAroundSelectedPoi"
        @zoom-click="goToSelectedFeature"
      />
    </div>
    <div class="tw-grow">
      <div
        v-if="initialBbox"
        class="tw-flex tw-flex-col tw-h-screen tw-relative"
      >
        <MapFeatures
          ref="mapFeaturesRef"
          :default-bounds="initialBbox"
          :fit-bounds-padding-options="fitBoundsPaddingOptions"
          :extra-attributions="settings!.attributions"
          :categories="apiMenuCategory || []"
          :features="mapFeatures"
          :selected-categories-ids="selectedCategoryIds"
          :style-icon-filter="poiFilters"
          :cooperative-gestures="false"
          :boundary-area="boundaryArea || settings!.polygon.data"
        />
        <CategorySelector
          v-if="!isFiltersEqualToCategoryId"
          :filters="filters"
          :menu-items="menuItems || {}"
          label="categorySelector.placeholderAdd"
          class="tw-p-4 tw-absolute tw-z-1 tw-w-full"
          @category-change="onMenuChange"
        />
        <div class="tw-p-4 tw-pt-24 tw-absolute tw-flex tw-gap-4">
          <SelectedCategories v-if="!isFiltersEqualToCategoryId" />
          <IsochroneStatus v-if="isochroneCurrentFeature" />
        </div>
      </div>
    </div>
  </div>
</template>
