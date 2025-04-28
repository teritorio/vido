<script setup lang="ts">
import type { FitBoundsOptions, LngLatBounds, MapGeoJSONFeature } from 'maplibre-gl'
import { storeToRefs } from 'pinia'
import type { MultiPolygon, Polygon } from 'geojson'
import { decodeBase32 } from 'geohashing'
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
import type { MenuItem } from '~/lib/apiMenu'
import type { ApiPoi } from '~/lib/apiPois'
import { getPois } from '~/lib/apiPois'
import { getBBox } from '~/lib/bbox'
import { favoriteStore as useFavoriteStore } from '~/stores/favorite'
import { mapStore as useMapStore } from '~/stores/map'
import { menuStore as useMenuStore } from '~/stores/menu'
import { useSiteStore } from '~/stores/site'
import { Mode, OriginEnum } from '~/utils/types'
import { getHashPart, setHashParts } from '~/utils/url'
import { flattenFeatures, formatApiAddressToFeature } from '~/utils/utilities'
import useDevice from '~/composables/useDevice'
import type { ApiAddrSearchResult, ApiSearchResult } from '~/lib/apiSearch'
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
const { center, isModeFavorites, isModeExplorer, isModeExplorerOrFavorites, mode, selectedFeature, teritorioCluster } = storeToRefs(mapStore)
const menuStore = useMenuStore()
const { apiMenuCategory, features, selectedCategoryIds } = storeToRefs(menuStore)
const favoriteStore = useFavoriteStore()
const { favoritesIds, favoriteAddresses, favoriteFeatures, favoriteCount } = storeToRefs(favoriteStore)
const siteStore = useSiteStore()
const { config, settings } = siteStore
const { favoritesModeEnabled } = storeToRefs(siteStore)
const { $tracking } = useNuxtApp()
const route = useRoute()
const router = useRouter()
const device = useDevice()
const { isochroneCurrentFeature } = useIsochrone()

//
// Data
//
const allowRegionBackZoom = ref<boolean>(false)
const isFilterActive = ref<boolean>(false)
const initialBbox = ref<LngLatBounds>()
const isMenuItemOpen = ref<boolean>(false)
const isOnSearch = ref<boolean>(false)
const showFavoritesOverlay = ref<boolean>(false)
const isPoiCardShown = ref<boolean>(false)
const mapFeaturesRef = ref<InstanceType<typeof MapFeatures>>()

//
// Hooks
//
onBeforeMount(async () => {
  const favs = getHashPart(router, 'favs')
  if (favs) {
    try {
      const addressHashes: string[] = []

      favs
        .split(',')
        .forEach((id) => {
          if (!Number.isNaN(Number(id)))
            favoriteStore.toggleFavorite(Number(id))

          if (id.startsWith('addr:'))
            addressHashes.push(id.substring(5))
        })

      await Promise.all(addressHashes.map(async (hash) => {
        const address = await fetchAddress(hash)

        if (!address || !address.features.length)
          throw createError({ statusCode: 404, message: `Error while reverse geocoding: ${hash}` })

        favoriteStore.toggleFavoriteAddr(formatApiAddressToFeature(address.features[0]))
      }))
    }
    catch (e) {
      console.error('Vido error:', (e as Error).message)
    }
  }

  favoriteStore.init()

  const modeHash = getHashPart(router, 'mode')
  mode.value = Mode[Object.keys(Mode).find(key => Mode[key as keyof typeof Mode] === modeHash) as keyof typeof Mode] || Mode.BROWSER
})

onMounted(() => {
  $tracking({
    type: 'page',
    title: (route.name && String(route.name)) || undefined,
    location: window.location.href,
    path: route.path,
    origin: OriginEnum[router.currentRoute.value.query.origin as keyof typeof OriginEnum],
  })

  initialBbox.value = getBBox({ type: 'Feature', geometry: props.boundaryArea || settings!.bbox_line, properties: {} })
})

//
// Computed
//
const isBottomMenuOpened = computed(() => {
  return ((device.value.smallScreen && isPoiCardShown.value) || isMenuItemOpen.value)
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
      bottom: isPoiCardShown.value ? 400 : 100,
      right: 100,
      left: isModeExplorerOrFavorites.value ? 50 : 500,
    }
  }
})

const logoUrl = computed(() => {
  return settings!.themes[0]?.logo_url || ''
})

const mainUrl = computed(() => {
  return settings!.themes[0]?.main_url?.fr || '/'
})

const target = computed(() => {
  return settings!.themes[0]?.main_url?.fr ? '_blank' : '_self'
})

const mapFeatures = computed(() => {
  let f: ApiPoi[]
  switch (mode.value as Mode) {
    case Mode.BROWSER:
      f = flattenFeatures(features.value)
      break
    case Mode.FAVORITES:
      f = favoriteFeatures.value
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
    || undefined
  )
})

const siteName = computed(() => {
  return settings!.themes[0]?.title.fr || ''
})

//
// Watchers
//
watch(selectedFeature, (newFeature) => {
  isPoiCardShown.value = !!newFeature

  if (process.client) {
    routerPushUrl()

    if (newFeature) {
      $tracking({
        type: 'popup',
        poiId: newFeature.properties.metadata.id || newFeature.properties?.id,
        title: newFeature.properties?.name,
        location: window.location.href,
        path: route.path,
        categoryIds: newFeature.properties?.metadata?.category_ids || [],
      })
    }
  }
}, { immediate: true })

watch(selectedCategoryIds, (a, b) => {
  if (a !== b) {
    routerPushUrl()

    menuStore.fetchFeatures({
      vidoConfig: config!,
      categoryIds: selectedCategoryIds.value,
      clipingPolygonSlug: route.query.clipingPolygonSlug?.toString(),
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

watch(isModeFavorites, async (isEnabled) => {
  if (isEnabled) {
    if (favoriteCount.value !== favoriteFeatures.value.length
      || favoriteFeatures.value.some(f =>
        !favoritesIds.value.includes(f.properties.metadata.id)
        && !favoriteAddresses.value.has(f.properties.metadata.id.toString()),
      )
    ) {
      await handleFavorites()
    }

    initialBbox.value = getBBox({ type: 'FeatureCollection', features: favoriteFeatures.value })
  }
})

//
// Methods
//
function goToSelectedFeature(feature?: ApiPoi) {
  if (mapFeaturesRef.value) {
    if (feature && selectedFeature.value?.properties.metadata.id !== feature.properties.metadata.id)
      mapFeaturesRef.value.updateSelectedFeature(feature)
    mapFeaturesRef.value.goToSelectedFeature()
  }
}

async function fetchAddress(hash: string) {
  try {
    const coordinates = decodeBase32(hash)
    return await $fetch<ApiSearchResult<ApiAddrSearchResult>>(`${config!.API_ADDR}/reverse?lon=${coordinates.lng}&lat=${coordinates.lat}&limit=1`)
  }
  catch (error: any) {
    console.error(error)
  }
}

async function fetchFavorites() {
  if (!favoritesIds.value.length)
    return []

  const query = {
    geometry_as: 'point',
  } as Record<string, any>

  if (route.query.clipingPolygonSlug)
    query.cliping_polygon_slug = route.query.clipingPolygonSlug.toString()

  return await getPois(config!, favoritesIds.value, query)
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
  favoriteFeatures.value = []

  const favorites = await fetchFavorites()
  const favoriteAddresses = await handleFavoriteAddresses()

  favoriteFeatures.value = [...favoriteFeatures.value, ...favorites, ...favoriteAddresses]
}

async function handleFavoriteAddresses() {
  if (!favoriteAddresses.value.size)
    return []

  const promises = Array.from(favoriteAddresses.value.values()).map(async hash => await fetchAddress(hash))
  const responses = await Promise.all(promises)

  return responses
    .filter(Boolean)
    .map(address => formatApiAddressToFeature(address!.features[0]))
    .concat(favoriteFeatures.value)
}

function onActivateFilter(val: boolean) {
  isFilterActive.value = val
}

function onBottomMenuButtonClick() {
  isMenuItemOpen.value = !isMenuItemOpen.value
}

async function onQuitExplorerFavoriteMode() {
  if (mapFeaturesRef.value)
    await mapFeaturesRef.value.updateSelectedFeature()

  mode.value = Mode.BROWSER
}

function toggleFavoriteMode() {
  if (favoriteCount.value) {
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

async function toggleNoteBookMode() {
  if (favoriteCount.value !== favoriteFeatures.value.length
    || favoriteFeatures.value.some(f =>
      !favoritesIds.value.includes(f.properties.metadata.id)
      && !favoriteAddresses.value.has(f.properties.metadata.id.toString()),
    )
  ) {
    await handleFavorites()
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
  if (!isModeExplorer.value) {
    mode.value = Mode.EXPLORER
    goToSelectedFeature(feature)

    if (device.value.smallScreen)
      isPoiCardShown.value = false
  }
  else {
    allowRegionBackZoom.value = false
    mode.value = Mode.BROWSER
  }
}

function toggleFavorite(feature: ApiPoi) {
  try {
    if (feature.properties.internalType === 'address')
      favoriteStore.toggleFavoriteAddr(feature)
    else
      favoriteStore.toggleFavorite(feature)
  }
  catch (e) {
    console.error('Vido error:', (e as Error).message)
  }
}

function searchSelectFeature(feature: ApiPoi) {
  goToSelectedFeature(feature)
  teritorioCluster.value?.setSelectedFeature(feature as unknown as MapGeoJSONFeature)
}

const bottomMenuRef = ref<HTMLDivElement>()
function scrollTop() {
  if (bottomMenuRef.value)
    bottomMenuRef.value.scrollTop = 0

  const header = document.getElementById('header-menu')
  if (header)
    header.scrollTop = 0
}

function handlePoiCardClose() {
  if (mapFeaturesRef.value) {
    mapFeaturesRef.value.updateSelectedFeature()
  }
}
</script>

<template>
  <div
    class="tw-fixed tw-w-full tw-h-full tw-overflow-hidden tw-flex tw-flex-col"
  >
    <h1 class="tw-absolute tw-text-white">
      {{ siteName }}
    </h1>
    <ClientOnly>
      <header
        class="tw-flex md:tw-hidden tw-relative tw-fidex tw-top-0 tw-bottom-0 tw-z-10 tw-flex-row tw-w-full tw-space-x-4"
      >
        <div class="tw-w-full" :class="[isBottomMenuOpened && 'tw-hidden']">
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
                :target="target"
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
        </div>
      </header>
    </ClientOnly>

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
                :target="target"
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
        <IsochroneStatus v-if="isochroneCurrentFeature" />
        <div class="tw-grow" style="margin-left: 0" />
        <div
          class="tw-flex-none tw-flex" :class="[isBottomMenuOpened && 'hidden']"
        >
          <FavoriteMenu
            v-if="favoritesModeEnabled"
            @explore-click="toggleExploreAroundSelectedPoi"
            @favorite-click="toggleFavorite"
            @toggle-favorite-mode="toggleFavoriteMode"
            @toggle-note-book-mode="toggleNoteBookMode"
            @zoom-click="goToSelectedFeature"
          />
          <NavMenu id="nav-menu" class="tw-ml-3 sm:tw-ml-4" />
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
          :selected-categories-ids="selectedCategoryIds"
          :style-icon-filter="poiFilters"
          :enable-filter-route-by-categories="!isModeFavorites"
          :enable-filter-route-by-features="true"
          :boundary-area="boundaryArea || settings!.polygon.data"
        >
          <div class="tw-relative">
            <button
              v-if="!(isModeExplorer || isModeFavorites || isPoiCardShown)"
              type="button"
              class="md:tw-hidden tw-absolute -tw-top-12 tw-z-0 tw-w-1/4 tw-h-12 tw-transition-all tw-rounded-t-lg tw-text-sm tw-font-medium tw-px-5 tw-shadow-lg tw-outline-none focus:tw-outline-none tw-bg-white tw-text-zinc-800 hover:tw-bg-zinc-100 focus-visible:tw-bg-zinc-100"
              style="right: 37.5%"
              @click="onBottomMenuButtonClick"
            >
              <span>{{ $t('headerMenu.burgerLabel') }}</span>
            </button>
          </div>
        </MapFeatures>
      </div>
    </div>

    <FavoritesOverlay
      v-if="showFavoritesOverlay"
      @discard="showFavoritesOverlay = false"
    />

    <ClientOnly>
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
              && isPoiCardShown
          "
          :poi="selectedFeature"
          class="tw-grow-0"
          @explore-click="toggleExploreAroundSelectedPoi(undefined)"
          @favorite-click="toggleFavorite"
          @zoom-click="goToSelectedFeature"
          @on-close="handlePoiCardClose"
        />
        <div class="tw-grow-[3]" />
      </div>
    </ClientOnly>

    <ClientOnly>
      <BottomMenu class="md:tw-hidden" :is-open="isBottomMenuOpened">
        <div
          ref="bottomMenuRef"
          class="tw-flex-1 tw-h-full tw-overflow-y-auto tw-h-screen-3/5 tw-divide-y"
        >
          <Menu
            v-if="!isPoiCardShown"
            menu-block="MenuBlockBottom"
            @scroll-top="scrollTop"
          />
          <PoiCard
            v-else-if="
              selectedFeature
                && selectedFeature.properties
                && selectedFeature.properties.metadata
                && isPoiCardShown
            "
            :poi="selectedFeature"
            class="tw-grow-0 tw-text-left tw-h-full"
            @explore-click="toggleExploreAroundSelectedPoi(undefined)"
            @favorite-click="toggleFavorite"
            @zoom-click="goToSelectedFeature"
            @on-close="handlePoiCardClose"
          />
        </div>
      </BottomMenu>
    </ClientOnly>

    <ClientOnly>
      <footer class="tw-z-20">
        <CookiesConsent />
      </footer>
    </ClientOnly>
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
