<template>
  <div
    class="tw-fixed tw-w-full tw-h-full tw-overflow-hidden tw-flex tw-flex-col"
  >
    <h1 class="tw-absolute tw-text-white">{{ siteName }}</h1>
    <header
      class="tw-flex md:tw-hidden tw-relative tw-fidex tw-top-0 tw-bottom-0 tw-z-10 tw-flex-row tw-w-full tw-space-x-4"
    >
      <div :class="['tw-w-full', isBottomMenuOpened && 'tw-hidden']">
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
          :class="[
            'tw-hidden md:tw-block',
            'flex-none tw-max-w-md tw-overflow-scroll flex-shrink-0',
          ]"
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
          :class="['tw-flex-none', 'tw-flex', isBottomMenuOpened && 'hidden']"
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
          ref="mapFeatures"
          :default-bounds="initialBbox"
          :fit-bounds-padding-options="fitBoundsPaddingOptions"
          :extra-attributions="settings.attributions"
          :small="isBottomMenuOpened"
          :categories="apiMenuCategory || []"
          :features="mapFeatures"
          :selected-categories-ids="isModeExplorer ? [] : selectedCategoryIds"
          :style-icon-filter="poiFilters"
          :explorer-mode-enabled="explorerModeEnabled"
          :enable-filter-route-by-categories="!isModeFavorites"
          :enable-filter-route-by-features="isModeFavorites"
          :boundary-area="boundaryArea || settings.polygon.data"
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
          selectedFeature &&
          selectedFeature.properties &&
          selectedFeature.properties.metadata &&
          showPoi
        "
        :poi="selectedFeature"
        class="tw-grow-0"
        :explorer-mode-enabled="explorerModeEnabled"
        :favorites-mode-enabled="favoritesModeEnabled"
        @explore-click="toggleExploreAroundSelectedPoi"
        @favorite-click="toggleFavorite"
        @zoom-click="goToSelectedFeature"
      />
      <div class="tw-grow-[3]" />
    </div>

    <BottomMenu class="md:tw-hidden" :is-open="isBottomMenuOpened">
      <div
        ref="bottomMenu"
        class="tw-flex-1 tw-h-full tw-overflow-y-auto tw-h-screen-3/5 tw-divide-y"
      >
        <Menu
          v-if="!showPoi"
          menu-block="MenuBlockBottom"
          @scroll-top="scrollTop"
        />
        <PoiCard
          v-else-if="
            selectedFeature &&
            selectedFeature.properties &&
            selectedFeature.properties.metadata &&
            showPoi
          "
          :poi="selectedFeature"
          class="tw-grow-0 tw-text-left tw-h-full"
          :explorer-mode-enabled="explorerModeEnabled"
          :favorites-mode-enabled="favoritesModeEnabled"
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

<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { FitBoundsOptions, LngLatBoundsLike } from 'maplibre-gl'
import { mapActions, mapState } from 'pinia'
import { PropType, ref } from 'vue'

import { defineNuxtComponent } from '#app'
import ExplorerOrFavoritesBack from '~/components/Home/ExplorerOrFavoritesBack.vue'
import HomeMixin from '~/components/Home/HomeMixin'
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
import { ContentEntry } from '~/lib/apiContent'
import { ApiMenuCategory, MenuItem } from '~/lib/apiMenu'
import { ApiPoi, getPois } from '~/lib/apiPois'
import { headerFromSettings } from '~/lib/apiSettings'
import { getBBoxFeature, getBBoxFeatures } from '~/lib/bbox'
import { favoritesStore } from '~/stores/favorite'
import { mapStore } from '~/stores/map'
import { menuStore } from '~/stores/menu'
import { Mode, OriginEnum } from '~/utils/types'
import { getHashPart, setHashParts } from '~/utils/url'
import { flattenFeatures } from '~/utils/utilities'

export default defineNuxtComponent({
  components: {
    FontAwesomeIcon,
    Logo,
    FavoriteMenu,
    FavoritesOverlay,
    NavMenu,
    MapFeatures,
    Search,
    SelectedCategories,
    Menu,
    MenuBlock,
    BottomMenu,
    PoiCard,
    CookiesConsent,
    ExplorerOrFavoritesBack,
  },
  mixins: [HomeMixin],

  props: {
    navMenuEntries: {
      type: Array as PropType<ContentEntry[]>,
      required: true,
    },
  },

  setup() {
    return {
      bottomMenu: ref<InstanceType<typeof HTMLDivElement>>(),
    }
  },

  data(): {
    isMenuItemOpen: boolean
    showPoi: boolean
    showFavoritesOverlay: boolean
    allowRegionBackZoom: boolean
    favorites: ApiPoi[] | null
    isOnSearch: boolean
    isFilterActive: boolean
  } {
    return {
      isMenuItemOpen: false,
      showPoi: false,
      showFavoritesOverlay: false,
      allowRegionBackZoom: false,
      favorites: null,
      isOnSearch: false,
      isFilterActive: false,
    }
  },

  computed: {
    ...mapState(menuStore, ['features']),
    ...mapState(mapStore, [
      'center',
      'isModeFavorites',
      'isModeExplorerOrFavorites',
    ]),
    ...mapState(favoritesStore, ['favoritesIds']),

    logoUrl(): string {
      return this.settings.themes[0]?.logo_url || ''
    },

    siteName(): string {
      return this.settings.themes[0]?.title.fr || ''
    },

    mainUrl(): string {
      return this.settings.themes[0]?.main_url?.fr || ''
    },

    isPoiCardVisible(): boolean {
      return !!(this.selectedFeature && this.showPoi)
    },

    isBottomMenuOpened(): boolean {
      return (
        (this.$device.value.smallScreen && this.isPoiCardVisible) ||
        this.isMenuItemOpen
      )
    },

    menuItemsToIcons(): Record<MenuItem['id'], string> {
      const resources: Record<MenuItem['id'], string> = {}

      Object.values(this.apiMenuCategory || {}).forEach((sc) => {
        resources[sc.id] = (sc.menu_group || sc.link || sc.category).icon
      })

      return resources
    },

    fitBoundsPaddingOptions(): FitBoundsOptions['padding'] {
      if (this.$device.value.smallScreen) {
        return {
          top: 100,
          bottom: 50,
          right: 100,
          left: 50,
        }
      } else {
        return {
          top: 100,
          bottom: this.isPoiCardVisible ? 400 : 100,
          right: 100,
          left: this.isModeExplorerOrFavorites ? 50 : 500,
        }
      }
    },

    mapFeatures(): ApiPoi[] {
      let feature: ApiPoi[]
      switch (this.mode as Mode) {
        case Mode.BROWSER:
          feature = flattenFeatures(this.features)
          break
        case Mode.FAVORITES:
          feature = this.favorites || []
          break
        case Mode.EXPLORER:
          feature = []
          break
      }
      return feature
    },
  },

  watch: {
    selectedFeature() {
      this.showPoi = !!this.selectedFeature
      this.routerPushUrl()

      if (this.selectedFeature) {
        this.$tracking({
          type: 'popup',
          poiId:
            this.selectedFeature.properties.metadata.id ||
            this.selectedFeature.properties?.id,
          title: this.selectedFeature.properties?.name,
          location: window.location.href,
          path: this.$route.path,
          categoryIds:
            this.selectedFeature.properties?.metadata?.category_ids || [],
        })
      }
    },

    selectedCategoryIds(a, b) {
      if (a !== b) {
        this.routerPushUrl()

        menuStore().fetchFeatures({
          apiEndpoint: this.$vidoConfig().API_ENDPOINT,
          apiProject: this.$vidoConfig().API_PROJECT,
          apiTheme: this.$vidoConfig().API_THEME,
          categoryIds: this.selectedCategoryIds,
        })
        this.allowRegionBackZoom = true
      }
    },

    mode() {
      this.allowRegionBackZoom = false

      const hash: { [key: string]: string | null } = {
        mode: this.mode !== Mode.BROWSER ? this.mode : null,
      }
      this.routerPushUrl(hash)
    },

    isModeFavorites() {
      this.handleFavorites()
    },
  },

  beforeMount() {
    this.mode =
      Mode[getHashPart(this.$router, 'mode') as keyof typeof Mode] ||
      Mode.BROWSER

    const favs = getHashPart(this.$router, 'favs')
    if (favs) {
      try {
        const newFavorite = favs
          .split(',')
          .map((e) => (!isNaN(Number(e)) ? Number(e) : null))
          .filter((e) => !!e) as Number[]

        this.setFavorites(newFavorite)
        this.handleFavorites()
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Vido error:', (e as Error).message)
      }
    } else {
      favoritesStore().initFavoritesFromLocalStorage()
    }
  },

  mounted() {
    this.$tracking({
      type: 'page',
      title: (this.$route.name && String(this.$route.name)) || undefined,
      location: window.location.href,
      path: this.$route.path,
      origin:
        OriginEnum[
          this.$router.currentRoute.value.query
            .origin as keyof typeof OriginEnum
        ],
    })

    if (this.mode === Mode.FAVORITES) {
      this.handleFavorites().then((favorites) => {
        if (favorites) {
          this.initialBbox = getBBoxFeatures(favorites)
        }
      })
    } else {
      if (this.boundaryArea) {
        this.initialBbox = getBBoxFeature(this.boundaryArea)
      } else {
        // @ts-ignore
        this.initialBbox = this.settings.bbox_line.coordinates
      }
    }
  },

  methods: {
    ...mapActions(favoritesStore, ['setFavorites']),

    routerPushUrl(hashUpdate: { [key: string]: string | null } = {}) {
      const categoryIds = this.selectedCategoryIds.join(',')
      const id =
        this.selectedFeature?.properties?.metadata?.id?.toString() ||
        this.selectedFeature?.id?.toString() ||
        null

      let hash = this.$router.currentRoute.value.hash
      if (hashUpdate) {
        hash = setHashParts(hash, hashUpdate)
      }

      this.$router.push({
        path:
          this.mode !== Mode.BROWSER
            ? '/'
            : (categoryIds ? `/${categoryIds}/` : '/') + (id ? `${id}` : ''),
        query: this.$router.currentRoute.value.query,
        hash,
      })
    },

    onQuitExplorerFavoriteMode() {
      this.mode = Mode.BROWSER
      this.setSelectedFeature(null)
    },

    onBottomMenuButtonClick() {
      if (!this.isModeFavorites) {
        if (this.isBottomMenuOpened) {
          if (this.selectedFeature) {
            this.setPoiVisibility(false)
          }
          this.isMenuItemOpen = false
        } else if (!this.isModeExplorer) {
          this.isMenuItemOpen = true
        } else if (this.selectedFeature && !this.isPoiCardVisible) {
          this.setPoiVisibility(true)
        }
      } else if (this.selectedFeature) {
        if (!this.isModeExplorer && !this.showPoi) {
          this.setSelectedFeature(null)
        } else {
          this.setPoiVisibility(false)
        }
      }
    },

    onShowPoi(show: boolean) {
      this.showPoi = show
    },

    onActivateFilter(val: boolean) {
      this.isFilterActive = val
    },

    toggleExploreAroundSelectedPoi(feature?: ApiPoi) {
      if (feature) {
        this.setSelectedFeature(feature)
      }
      if (!this.isModeExplorer) {
        this.mode = Mode.EXPLORER
        this.goToSelectedFeature()

        if (this.$device.value.smallScreen) {
          this.showPoi = false
        }
      } else {
        this.allowRegionBackZoom = false
        this.mode = Mode.BROWSER
      }
    },

    toggleFavorite(feature: ApiPoi) {
      try {
        favoritesStore().toggleFavorite(feature)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Vido error:', (e as Error).message)
      }
    },

    setPoiVisibility(visible: boolean) {
      this.showPoi = visible
    },

    onToggleFavoritesMode() {
      if (this.favoritesIds?.length > 0) {
        this.$tracking({ type: 'map_control_event', event: 'favorite' })
        if (!this.isModeFavorites) {
          this.mode = Mode.FAVORITES
        } else {
          this.mode = Mode.BROWSER
        }
      } else {
        this.showFavoritesOverlay = true
      }
    },

    scrollTop() {
      if (this.bottomMenu) {
        this.bottomMenu.scrollTop = 0
      }
      const header = document.getElementById('header-menu')
      if (header) {
        header.scrollTop = 0
      }
    },

    handleFavorites(): Promise<void | ApiPoi[]> {
      return this.fetchFavorites(this.favoritesIds)
        .then((favorites) => {
          this.favorites = favorites
          return this.favorites
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.error('Vido error:', (e as Error).message)
        })
    },

    fetchFavorites(ids: Number[]): Promise<ApiPoi[]> {
      return getPois(
        this.$vidoConfig().API_ENDPOINT,
        this.$vidoConfig().API_PROJECT,
        this.$vidoConfig().API_THEME,
        ids
      )
        .then((pois) => (pois && pois.features) || [])
        .then((pois) =>
          pois.map((poi) => ({
            ...poi,
            properties: {
              ...poi.properties,
              vido_cat: poi.properties.metadata?.category_ids?.[0],
            },
          }))
        )
    },

    searchSelectFeature(feature: ApiPoi) {
      this.setSelectedFeature(feature)
      this.goToSelectedFeature()
    },
  },
})
</script>

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

.right-3\/8 {
  right: 37.5%;
}
</style>
