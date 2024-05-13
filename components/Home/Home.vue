<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { FitBoundsOptions, LngLatBounds } from 'maplibre-gl'
import { storeToRefs } from 'pinia'
import type { MultiPolygon, Polygon } from 'geojson'
import ExplorerOrFavoritesBack from '~/components/Home/ExplorerOrFavoritesBack.vue'
import Menu from '~/components/Home/Menu.vue'
import MenuBlock from '~/components/Home/MenuBlock.vue'
import SelectedCategories from '~/components/Home/SelectedCategories.vue'
import BottomMenu from '~/components/MainMap/BottomMenu.vue'
import FavoriteMenu from '~/components/MainMap/FavoriteMenu.vue'
import FavoritesOverlay from '~/components/MainMap/FavoritesOverlay.vue'
import MapFeatures from '~/components/MainMap/MapFeatures.vue'
import NavMenu from '~/components/MainMap/NavMenu.vue'
import PoiCard from '~/components/PoisCard/PoiCard.vue'
import Search from '~/components/Search/Search.vue'
import CookiesConsent from '~/components/UI/CookiesConsent.vue'
import Logo from '~/components/UI/Logo.vue'
import type { ContentEntry } from '~/lib/apiContent'
import type { ApiMenuCategory, MenuItem } from '~/lib/apiMenu'
import type { ApiPoi } from '~/lib/apiPois'
import { getPois } from '~/lib/apiPois'
import { getBBoxFeature, getBBoxFeatures } from '~/lib/bbox'
import { favoritesStore as useFavoritesStore } from '~/stores/favorite'
import { mapStore as useMapStore } from '~/stores/map'
import { menuStore as useMenuStore } from '~/stores/menu'
import { siteStore as useSiteStore } from '~/stores/site'
import { Mode, OriginEnum } from '~/utils/types'
import { getHashPart, setHashParts } from '~/utils/url'
import { flattenFeatures } from '~/utils/utilities'
import useDevice from '~/composables/useDevice'

//
// Props
//
const props = defineProps<{
  boundaryArea?: Polygon | MultiPolygon
  initialCategoryIds?: number[]
  initialPoi?: ApiPoi
  navMenuEntries: ContentEntry[]
}>()

//
// Data
//
const mapStore = useMapStore()
const { center, isModeFavorites, isModeExplorer, isModeExplorerOrFavorites, mode, selectedFeature } = storeToRefs(mapStore)
const menuStore = useMenuStore()
const { apiMenuCategory, features, selectedCategoryIds } = storeToRefs(menuStore)
const favoritesStore = useFavoritesStore()
const { favoritesIds } = storeToRefs(favoritesStore)
const { config, settings } = useSiteStore()

const allowRegionBackZoom = ref<boolean>(false)
const favorites = ref<ApiPoi[] | null>(null)
const isFilterActive = ref<boolean>(false)
const initialBbox = ref<LngLatBounds | null>(null)
const isMenuItemOpen = ref<boolean>(false)
const isOnSearch = ref<boolean>(false)
const showFavoritesOverlay = ref<boolean>(false)
const showPoi = ref<boolean>(false)

//
// Composables
//
const { $tracking } = useNuxtApp()
const route = useRoute()
const router = useRouter()
const device = useDevice()

//
// Hooks
//
onMounted(async () => {
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

  if (props.initialPoi)
    mapStore.setSelectedFeature(props.initialPoi)

  $tracking({
    type: 'page',
    title: (route.name && String(route.name)) || undefined,
    location: window.location.href,
    path: route.path,
    origin: OriginEnum[router.currentRoute.value.query.origin as keyof typeof OriginEnum],
  })

  if (mode.value === Mode.FAVORITES) {
    await handleFavorites().then((favorites) => {
      if (favorites)
        initialBbox.value = getBBoxFeatures(favorites)
    })
  }
  else {
    if (props.boundaryArea) {
      initialBbox.value = getBBoxFeature(props.boundaryArea)
    }
    else {
      // @ts-expect-error: setting wrong type to initialBbox
      initialBbox.value = settings!.bbox_line.coordinates
    }
  }
})

onBeforeMount(async () => {
  const modeHash = getHashPart(router, 'mode')
  mode.value = Mode[Object.keys(Mode).find(key => Mode[key as keyof typeof Mode] === modeHash) as keyof typeof Mode] || Mode.BROWSER

  const favs = getHashPart(router, 'favs')
  if (favs) {
    try {
      const newFavorite = favs
        .split(',')
        .map(e => (!Number.isNaN(Number(e)) ? Number(e) : null))
        .filter(e => !!e) as number[]

      favoritesStore.setFavorites(newFavorite)
      await handleFavorites()
    }
    catch (e) {
      console.error('Vido error:', (e as Error).message)
    }
  }
  else {
    favoritesStore.initFavoritesFromLocalStorage()
  }
})

//
// Computed
//
const explorerModeEnabled = computed(() => {
  return settings!.themes[0]?.explorer_mode ?? true
})

const favoritesModeEnabled = computed(() => {
  return settings!.themes[0]?.favorites_mode ?? true
})

const isPoiCardVisible = computed(() => {
  return !!(selectedFeature.value && showPoi.value)
})

const isBottomMenuOpened = computed(() => {
  return ((device.value.smallScreen && isPoiCardVisible.value) || isMenuItemOpen.value)
})

const fitBoundsPaddingOptions = computed((): FitBoundsOptions['padding'] => {
  if (device.value.smallScreen) {
    return {
      top: 100,
      bottom: 50,
      right: 100,
      left: 50,
    }
  }
  else {
    return {
      top: 100,
      bottom: isPoiCardVisible.value ? 400 : 100,
      right: 100,
      left: isModeExplorerOrFavorites.value ? 50 : 500,
    }
  }
})

const logoUrl = computed(() => {
  return settings!.themes[0]?.logo_url || ''
})

const mainUrl = computed(() => {
  return settings!.themes[0]?.main_url?.fr || ''
})

const mapFeatures = computed(() => {
  let f: ApiPoi[]
  switch (mode.value as Mode) {
    case Mode.BROWSER:
      f = flattenFeatures(features.value)
      break
    case Mode.FAVORITES:
      f = favorites.value || []
      break
    case Mode.EXPLORER:
      f = []
      break
  }
  return f
})

const menuItemsToIcons = computed(() => {
  const resources: Record<MenuItem['id'], string> = {}
  Object.values(apiMenuCategory.value || {}).forEach((sc) => {
    resources[sc.id] = (sc.menu_group || sc.link || sc.category).icon
  })
  return resources
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

const siteName = computed(() => {
  return settings!.themes[0]?.title.fr || ''
})

//
// Watch
//
watch(selectedFeature, () => {
  showPoi.value = !!selectedFeature.value
  routerPushUrl()

  if (selectedFeature.value) {
    $tracking({
      type: 'popup',
      poiId:
            selectedFeature.value.properties.metadata.id
            || selectedFeature.value.properties?.id,
      title: selectedFeature.value.properties?.name,
      location: window.location.href,
      path: route.path,
      categoryIds: selectedFeature.value.properties?.metadata?.category_ids || [],
    })
  }
})

watch(selectedCategoryIds, (a, b) => {
  if (a !== b) {
    routerPushUrl()

    menuStore.fetchFeatures({
      vidoConfig: config!,
      categoryIds: selectedCategoryIds.value,
    })

    allowRegionBackZoom.value = true
  }
})

watch(mode, () => {
  allowRegionBackZoom.value = false

  const hash = {
    mode: mode.value !== Mode.BROWSER ? mode.value : null,
  }

  routerPushUrl(hash)
})

watch(isModeFavorites, async () => {
  await handleFavorites()
})

//
// Methods
//
const mapFeaturesRef = ref<InstanceType<typeof MapFeatures>>()
function goToSelectedFeature() {
  if (mapFeaturesRef.value)
    mapFeaturesRef.value.goToSelectedFeature()
}

async function fetchFavorites(ids: number[]) {
  return await getPois(config!, ids, {
    geometry_as: 'point',
  })
    .then(pois => (pois && pois.features) || [])
    .then(pois =>
      pois.map(poi => ({
        ...poi,
        properties: {
          ...poi.properties,
          vido_cat: poi.properties.metadata?.category_ids?.[0],
        },
      })),
    )
}

async function handleFavorites() {
  return await fetchFavorites(favoritesIds.value)
    .then((f) => {
      favorites.value = f
      return favorites.value
    })
    .catch((e) => {
      console.error('Vido error:', (e as Error).message)
    })
}

function onActivateFilter(val: boolean) {
  isFilterActive.value = val
}

function onBottomMenuButtonClick() {
  if (!isModeFavorites.value) {
    if (isBottomMenuOpened.value) {
      if (selectedFeature.value)
        setPoiVisibility(false)
      isMenuItemOpen.value = false
    }
    else if (!isModeExplorer.value) {
      isMenuItemOpen.value = true
    }
    else if (selectedFeature.value && !isPoiCardVisible.value) {
      setPoiVisibility(true)
    }
  }
  else if (selectedFeature.value) {
    if (!isModeExplorer.value && !showPoi.value)
      mapStore.setSelectedFeature(null)
    else
      setPoiVisibility(false)
  }
}

function onQuitExplorerFavoriteMode() {
  mode.value = Mode.BROWSER
  mapStore.setSelectedFeature(null)
}

function onToggleFavoritesMode() {
  if (favoritesIds.value.length) {
    $tracking({ type: 'map_control_event', event: 'favorite' })
    if (!isModeFavorites.value)
      mode.value = Mode.FAVORITES
    else
      mode.value = Mode.BROWSER
  }
  else {
    showFavoritesOverlay.value = true
  }
}

function routerPushUrl(hashUpdate: { [key: string]: string | null } = {}) {
  const categoryIds = selectedCategoryIds.value.join(',')
  const id = selectedFeature.value?.properties?.metadata?.id?.toString()
    || selectedFeature.value?.id?.toString()
    || null

  let hash = router.currentRoute.value.hash
  if (hashUpdate)
    hash = setHashParts(hash, hashUpdate)

  router.push({
    path: mode.value !== Mode.BROWSER
      ? '/'
      : (categoryIds ? `/${categoryIds}/` : '/') + (id ? `${id}` : ''),
    query: router.currentRoute.value.query,
    hash,
  })
}

function toggleExploreAroundSelectedPoi(feature?: ApiPoi) {
  if (feature)
    mapStore.setSelectedFeature(feature)

  if (!isModeExplorer.value) {
    mode.value = Mode.EXPLORER
    goToSelectedFeature()

    if (device.value.smallScreen)
      showPoi.value = false
  }
  else {
    allowRegionBackZoom.value = false
    mode.value = Mode.BROWSER
  }
}

function toggleFavorite(feature: ApiPoi) {
  try {
    favoritesStore.toggleFavorite(feature)
  }
  catch (e) {
    console.error('Vido error:', (e as Error).message)
  }
}

function searchSelectFeature(feature: ApiPoi) {
  mapStore.setSelectedFeature(feature)
  goToSelectedFeature()
}

const bottomMenuRef = ref<HTMLDivElement>()
function scrollTop() {
  if (bottomMenuRef.value)
    bottomMenuRef.value.scrollTop = 0

  const header = document.getElementById('header-menu')
  if (header)
    header.scrollTop = 0
}

function setPoiVisibility(visible: boolean) {
  showPoi.value = visible
}
</script>

<template>
  <div
    class="tw-fixed tw-w-full tw-h-full tw-overflow-hidden tw-flex tw-flex-col"
  >
    <h1 class="tw-absolute tw-text-white">
      {{ siteName }}
    </h1>
    <header
      class="tw-flex md:tw-hidden tw-relative tw-fidex tw-top-0 tw-bottom-0 tw-z-10 tw-flex-row tw-w-full tw-space-x-4"
    >
      <div class="tw-w-full" :class="[isBottomMenuOpened && 'tw-hidden']">
        <client-only>
          <aside
            v-if="!isModeExplorerOrFavorites"
            class="tw-flex tw-flex-col tw-max-h-full tw-px-5 tw-py-4 tw-space-y-6 tw-shadow-md tw-pointer-events-auto md:tw-rounded-xl md:tw-w-96 tw-bg-white tw-min-h-20"
          >
            <Search
              :menu-to-icon="menuItemsToIcons"
              :map-center="center"
              @select-feature="searchSelectFeature"
            >
              <Logo
                :main-url="mainUrl"
                :site-name="siteName"
                :logo-url="logoUrl"
                class="tw-flex-none md:tw-hidden tw-mr-2"
                image-class="tw-max-w-2xl tw-max-h-12 md:tw-max-h-16"
              />
            </Search>
          </aside>
          <aside
            v-else
            class="tw-flex tw-flex-col tw-max-h-full tw-px-5 tw-py-4 tw-space-y-6 tw-shadow-md tw-pointer-events-auto md:tw-rounded-xl md:tw-w-96 tw-bg-blue-500 md:tw-bg-white tw-text-white tw-h-20"
          >
            <ExplorerOrFavoritesBack @click="onQuitExplorerFavoriteMode" />
          </aside>
        </client-only>
      </div>
    </header>

    <div v-if="initialBbox" class="tw-w-full tw-h-full">
      <header
        class="tw-pointer-events-none tw-flex tw-flex-row tw-fixed tw-z-10 tw-w-full tw-h-auto tw-p-4 tw-pr-[10px] tw-space-x-4"
        style="max-height: calc(100vh - 30px)"
      >
        <transition-group
          id="header-menu"
          ref="headerMenu"
          tag="div"
          name="headers"
          appear
          mode="out-in"
          class="tw-pointer-events-auto tw-hidden md:tw-block flex-none tw-max-w-md tw-overflow-y-auto tw-overflow-x-clip flex-shrink-0"
        >
          <MenuBlock
            v-if="isModeExplorerOrFavorites"
            key="ExplorerOrFavoritesBack"
            extra-class-text-background="tw-bg-blue-500 tw-text-white"
          >
            <ExplorerOrFavoritesBack @click="onQuitExplorerFavoriteMode" />
          </MenuBlock>

          <Menu
            v-else
            key="Menu"
            menu-block="MenuBlock"
            :is-on-search="isOnSearch"
            :is-filter-active="isFilterActive"
            class="tw-px-1 tw-pb-1.5"
            @activate-filter="onActivateFilter"
            @scroll-top="scrollTop"
          >
            <Search
              :menu-to-icon="menuItemsToIcons"
              :map-center="center"
              @focus="isOnSearch = true"
              @blur="isOnSearch = false"
              @select-feature="searchSelectFeature"
            >
              <Logo
                :main-url="mainUrl"
                :site-name="siteName"
                :logo-url="logoUrl"
                class="tw-flex-none tw-mr-2"
                image-class="tw-max-w-2xl tw-max-h-12 md:tw-max-h-16"
              />
            </Search>
          </Menu>
        </transition-group>
        <SelectedCategories
          v-if="
            !isModeExplorer && selectedCategoryIds.length && !isModeFavorites
          "
          class="tw-hidden md:tw-block flex-shrink-1"
        />
        <div class="tw-grow" style="margin-left: 0" />
        <div
          class="tw-flex-none tw-flex" :class="[isBottomMenuOpened && 'hidden']"
        >
          <FavoriteMenu
            v-if="favoritesModeEnabled"
            :favorites-ids="favoritesIds"
            :explore-around-selected-poi="toggleExploreAroundSelectedPoi"
            :go-to-selected-poi="goToSelectedFeature"
            :toggle-favorite="toggleFavorite"
            :explorer-mode-enabled="explorerModeEnabled"
            @toggle-favorites="onToggleFavoritesMode"
          />
          <NavMenu
            id="nav-menu"
            :entries="navMenuEntries"
            class="tw-ml-3 sm:tw-ml-4"
          />
        </div>
      </header>

      <div
        class="tw-relative tw-flex tw-flex-col tw-w-full tw-h-full md:tw-h-full"
      >
        <MapFeatures
          ref="mapFeaturesRef"
          :default-bounds="initialBbox"
          :fit-bounds-padding-options="fitBoundsPaddingOptions"
          :extra-attributions="settings!.attributions"
          :small="isBottomMenuOpened"
          :categories="apiMenuCategory || []"
          :features="mapFeatures"
          :selected-categories-ids="isModeExplorer ? [] : selectedCategoryIds"
          :style-icon-filter="poiFilters"
          :explorer-mode-enabled="explorerModeEnabled"
          :enable-filter-route-by-categories="!isModeFavorites"
          :enable-filter-route-by-features="isModeFavorites"
          :boundary-area="boundaryArea || settings!.polygon.data"
        >
          <div class="tw-relative">
            <button
              v-if="
                !(isModeExplorer || isModeFavorites) || Boolean(selectedFeature)
              "
              type="button"
              class="md:tw-hidden tw-absolute -tw-top-12 tw-z-0 tw-w-1/4 tw-h-12 tw-transition-all tw-rounded-t-lg tw-text-sm tw-font-medium tw-px-5 tw-shadow-lg tw-outline-none focus:tw-outline-none tw-bg-white tw-text-zinc-800 hover:tw-bg-zinc-100 focus-visible:tw-bg-zinc-100"
              style="right: 37.5%"
              @click="onBottomMenuButtonClick"
            >
              <span class="tw-sr-only">{{ $t('headerMenu.categories') }}</span>
              <FontAwesomeIcon icon="grip-lines" size="lg" />
            </button>
          </div>
        </MapFeatures>
      </div>
    </div>

    <FavoritesOverlay
      v-if="showFavoritesOverlay"
      @discard="showFavoritesOverlay = false"
    />
    <div
      class="tw-hidden tw-fixed tw-inset-x-0 tw-bottom-0 md:tw-flex tw-overflow-y-auto tw-h-auto md:tw-left-8 md:tw-right-16 md:tw-bottom-5 tw-pointer-events-none"
    >
      <div class="tw-w-full tw-max-w-md" />
      <div class="tw-grow-[1]" />
      <PoiCard
        v-if="
          selectedFeature
            && selectedFeature.properties
            && selectedFeature.properties.metadata
            && showPoi
        "
        :poi="selectedFeature"
        class="tw-grow-0"
        :explorer-mode-enabled="explorerModeEnabled"
        :favorites-mode-enabled="favoritesModeEnabled && selectedFeature.properties.internalType !== 'address'"
        @explore-click="toggleExploreAroundSelectedPoi"
        @favorite-click="toggleFavorite"
        @zoom-click="goToSelectedFeature"
      />
      <div class="tw-grow-[3]" />
    </div>

    <BottomMenu class="md:tw-hidden" :is-open="isBottomMenuOpened">
      <div
        ref="bottomMenuRef"
        class="tw-flex-1 tw-h-full tw-overflow-y-auto tw-h-screen-3/5 tw-divide-y"
      >
        <Menu
          v-if="!showPoi"
          menu-block="MenuBlockBottom"
          @scroll-top="scrollTop"
        />
        <PoiCard
          v-else-if="
            selectedFeature
              && selectedFeature.properties
              && selectedFeature.properties.metadata
              && showPoi
          "
          :poi="selectedFeature"
          class="tw-grow-0 tw-text-left tw-h-full"
          :explorer-mode-enabled="explorerModeEnabled"
          :favorites-mode-enabled="favoritesModeEnabled && selectedFeature.properties.internalType !== 'address'"
          @explore-click="toggleExploreAroundSelectedPoi"
          @favorite-click="toggleFavorite"
          @zoom-click="goToSelectedFeature"
        />
      </div>
    </BottomMenu>
    <footer class="tw-z-20">
      <CookiesConsent />
    </footer>
  </div>
</template>

<style scoped>
.headers-enter-active,
.headers-leave-active {
  transition: opacity 0.1s, transform 0.1s;
}

.headers-enter {
  opacity: 0;
  transform: translateX(10px);
}

.headers-enter-to,
.headers-leave {
  opacity: 1;
  transform: translateY(0);
}

.headers-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.right-3 {
  right: 37.5%;
}
</style>
