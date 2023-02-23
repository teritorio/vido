<template>
  <div class="fixed w-full h-full overflow-hidden flex flex-col">
    <header
      class="hidden md:flex relative md:fixed top-0 z-10 flex flex-row w-full h-auto space-x-4 md:w-auto md:p-2"
      style="max-height: calc(100vh - 30px)"
    >
      <div
        class="flex flex-col justify-between w-full w-auto max-w-md space-y-4"
      >
        <transition-group
          id="header-menu"
          ref="headerMenu"
          tag="div"
          name="headers"
          appear
          mode="out-in"
          :class="['overflow-x-hidden', !isFilterActive && 'overflow-y-auto']"
        >
          <client-only>
            <MenuBlock
              v-if="isModeExplorerOrFavorites"
              key="ExplorerOrFavoritesBack"
              extra-class-text-background="bg-blue-500 text-white"
            >
              <ExplorerOrFavoritesBack @click="onQuitExplorerFavoriteMode" />
            </MenuBlock>

            <Menu
              v-else
              key="Menu"
              menu-block="MenuBlock"
              :is-on-search="isOnSearch"
              :is-filter-active="isFilterActive"
              @activate-filter="onActivateFilter"
              @scroll-top="scrollTop"
            >
              <Search
                :menu-to-icon="menuItemsToIcons"
                :map-center="map_center"
                @focus="isOnSearch = true"
                @blur="isOnSearch = false"
              >
                <Logo
                  :main-url="mainUrl"
                  :site-name="siteName"
                  :logo-url="logoUrl"
                  class="flex-none mr-2"
                  image-class="max-w-2xl max-h-12 md:max-h-16"
                />
              </Search>
            </Menu>
          </client-only>
        </transition-group>
      </div>
    </header>
    <div
      v-if="!isModeExplorer && selectedCategoryIds.length && !isModeFavorites"
      class="p-4 absolute z-10 hidden md:block"
      :style="selectedFeaturesStyles"
    >
      <SelectedCategories />
    </div>

    <header
      class="flex md:hidden relative fidex top-0 bottom-0 z-10 flex-row w-full space-x-4"
    >
      <div :class="['w-full', isBottomMenuOpened && 'hidden']">
        <client-only>
          <aside
            v-if="!isModeExplorerOrFavorites"
            class="flex flex-col max-h-full px-5 py-4 space-y-6 shadow-md pointer-events-auto md:rounded-xl md:w-96 bg-white min-h-20"
          >
            <Search :menu-to-icon="menuItemsToIcons" :map-center="map_center">
              <Logo
                :main-url="mainUrl"
                :site-name="siteName"
                :logo-url="logoUrl"
                class="flex-none md:hidden mr-2"
                image-class="max-w-2xl max-h-12 md:max-h-16"
              />
            </Search>
          </aside>
          <aside
            v-else
            class="flex flex-col max-h-full px-5 py-4 space-y-6 shadow-md pointer-events-auto md:rounded-xl md:w-96 bg-blue-500 md:bg-white text-white h-20"
          >
            <ExplorerOrFavoritesBack @click="onQuitExplorerFavoriteMode" />
          </aside>
        </client-only>
      </div>
    </header>

    <div v-if="initialBbox" class="w-full h-full">
      <div class="relative flex flex-col w-full h-full md:h-full">
        <MapFeatures
          ref="mapFeatures"
          :default-bounds="initialBbox"
          :fit-bounds-padding-options="fitBoundsPaddingOptions"
          :extra-attributions="settings.attributions"
          :small="isBottomMenuOpened"
          :categories="menuItems"
          :features="mapFeatures"
          :selected-categories-ids="isModeExplorer ? [] : selectedCategoryIds"
          :style-icon-filter="poiFilters"
          :explorer-mode-enabled="explorerModeEnabled"
          :enable-filter-route-by-categories="!isModeFavorites"
          :enable-filter-route-by-features="isModeFavorites"
          :boundary-area="settings.polygon"
        >
          <div class="relative">
            <button
              v-if="
                !(isModeExplorer || isModeFavorites) || Boolean(selectedFeature)
              "
              type="button"
              class="-top-12 z-0 absolute md:hidden right-3/8 left-3/8 w-1/4 h-12 transition-all rounded-t-lg text-sm font-medium px-5 space-x-1 shadow-lg outline-none focus:outline-none bg-white text-zinc-800 hover:bg-zinc-100 focus-visible:bg-zinc-100"
              @click="onBottomMenuButtonClick"
            >
              <span class="sr-only">{{ $tc('headerMenu.categories') }}</span>
              <font-awesome-icon icon="grip-lines" size="lg" />
            </button>
          </div>
        </MapFeatures>
        <div
          :class="[
            'absolute flex justify-end pointer-events-auto items-top pt-4 right-3 md:pt-0 top-4',
            isBottomMenuOpened && 'hidden',
          ]"
        >
          <FavoriteMenu
            v-if="favoritesModeEnabled"
            :has-favorites="favoritesIds.length !== 0"
            :explore-around-selected-poi="toggleExploreAroundSelectedPoi"
            :go-to-selected-poi="goToSelectedFeature"
            :toggle-favorite="toggleFavorite"
            :explorer-mode-enabled="explorerModeEnabled"
            @toggle-favorites="onToggleFavoritesMode"
          />
          <NavMenu
            id="nav-menu"
            :entries="navMenuEntries"
            class="ml-3 sm:ml-4"
          />
        </div>
      </div>
    </div>

    <FavoritesOverlay
      v-if="showFavoritesOverlay"
      @discard="showFavoritesOverlay = false"
    />
    <div
      class="hidden fixed inset-x-0 bottom-0 md:flex overflow-y-auto h-auto md:left-8 md:right-16 md:bottom-5 pointer-events-none"
    >
      <div class="w-full max-w-md" />
      <div class="grow-[1]" />
      <PoiCard
        v-if="
          selectedFeature &&
          selectedFeature.properties &&
          selectedFeature.properties.metadata &&
          showPoi
        "
        :poi="selectedFeature"
        class="grow-0"
        :explorer-mode-enabled="explorerModeEnabled"
        :favorites-mode-enabled="favoritesModeEnabled"
        @explore-click="toggleExploreAroundSelectedPoi"
        @favorite-click="toggleFavorite"
        @zoom-click="goToSelectedFeature"
      />
      <div class="grow-[3]" />
    </div>

    <BottomMenu class="md:hidden" :is-open="isBottomMenuOpened">
      <div
        ref="bottomMenu"
        class="flex-1 h-full overflow-y-auto h-screen-3/5 divide-y"
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
          class="grow-0 text-left h-full"
          :explorer-mode-enabled="explorerModeEnabled"
          :favorites-mode-enabled="favoritesModeEnabled"
          @explore-click="toggleExploreAroundSelectedPoi"
          @favorite-click="toggleFavorite"
          @zoom-click="goToSelectedFeature"
        />
      </div>
    </BottomMenu>
    <footer class="z-20">
      <CookiesConsent />
    </footer>
  </div>
</template>

<script lang="ts">
import { FitBoundsOptions, LngLatBoundsLike } from 'maplibre-gl'
import { PropType } from 'vue'
import { MetaInfo } from 'vue-meta'
import mixins from 'vue-typed-mixins'
import { mapGetters, mapActions } from 'vuex'

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
import { getBBoxFeatures } from '~/lib/bbox'
import { Mode, OriginEnum } from '~/utils/types'
import { getHashPart, setHashParts } from '~/utils/url'
import { flattenFeatures } from '~/utils/utilities'

export default mixins(HomeMixin).extend({
  components: {
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

  props: {
    navMenuEntries: {
      type: Array as PropType<ContentEntry[]>,
      required: true,
    },
  },

  data(): {
    isMenuItemOpen: boolean
    showPoi: boolean
    showFavoritesOverlay: boolean
    allowRegionBackZoom: boolean
    favorites: ApiPoi[] | null
    isOnSearch: boolean
    isFilterActive: boolean
    selectedFeaturesStyles: string
  } {
    return {
      isMenuItemOpen: false,
      showPoi: false,
      showFavoritesOverlay: false,
      allowRegionBackZoom: false,
      favorites: null,
      isOnSearch: false,
      isFilterActive: false,
      selectedFeaturesStyles: '',
    }
  },

  head(): MetaInfo {
    return headerFromSettings(this.settings, {
      title: this.settings.themes[0]?.title.fr,
    })
  },

  computed: {
    ...mapGetters({
      pois: 'menu/features',
      mode: 'map/mode',
      isModeFavorites: 'map/isModeFavorites',
      isModeExplorerOrFavorites: 'map/isModeExplorerOrFavorites',
      map_center: 'map/center',
      favoritesIds: 'favorite/favoritesIds',
    }),

    menuItems(): Record<ApiMenuCategory['id'], MenuItem> {
      return this.$store.getters['menu/menuItems']
    },

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
      return this.selectedFeature && this.showPoi
    },

    isBottomMenuOpened(): boolean {
      return (
        (this.$screen.smallScreen && this.isPoiCardVisible) ||
        this.isMenuItemOpen
      )
    },

    menuItemsToIcons(): Record<MenuItem['id'], string> {
      const resources: Record<MenuItem['id'], string> = {}

      Object.values(this.menuItems).forEach((sc) => {
        resources[sc.id] = (sc.menu_group || sc.link || sc.category).icon
      })

      return resources
    },

    fitBoundsPaddingOptions(): FitBoundsOptions['padding'] {
      if (this.$screen.smallScreen) {
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
          feature = flattenFeatures(this.pois)
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

        this.$store.dispatch('menu/fetchFeatures', {
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
    const mode = getHashPart(this.$router, 'mode') || Mode.BROWSER
    this.setMode(mode)

    const favs = getHashPart(this.$router, 'favs')
    if (favs) {
      try {
        const newFavorite = favs
          .split(',')
          .map((e) => (!isNaN(Number(e)) ? Number(e) : null))
          .filter((e) => !!e)

        this.setFavorites(newFavorite)
        this.handleFavorites()
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Vido error:', e.message)
      }
    } else {
      this.$store.dispatch('favorite/initFavoritesFromLocalStorage')
    }
  },

  mounted() {
    const that = this
    const resizeObserver = new ResizeObserver((el) => {
      that.selectedFeaturesStyles = `
        left: ${el[0].contentRect.width}px;
        max-width: calc(100vw - 670px);
      `
    })

    const header = document.getElementById('header-menu')

    if (header) {
      resizeObserver.observe(header)
    }

    this.$tracking({
      type: 'page',
      title: this.$meta().refresh().metaInfo.title,
      location: window.location.href,
      path: this.$route.path,
      origin:
        OriginEnum[
          this.$router.currentRoute.query.origin as keyof typeof OriginEnum
        ],
    })

    if (this.mode === Mode.FAVORITES) {
      this.handleFavorites().then((favorites) => {
        if (favorites) {
          this.initialBbox = getBBoxFeatures(favorites)
        }
      })
    } else {
      // @ts-ignore
      this.initialBbox = this.settings.bbox_line.coordinates
    }
  },

  methods: {
    ...mapActions({
      setFavorites: 'favorite/setFavorites',
    }),

    routerPushUrl(hashUpdate: { [key: string]: string | null } = {}) {
      const categoryIds = this.selectedCategoryIds.join(',')
      const id =
        this.selectedFeature?.properties?.metadata?.id?.toString() ||
        this.selectedFeature?.id?.toString() ||
        null

      let hash = this.$router.currentRoute.hash
      if (hashUpdate) {
        hash = setHashParts(hash, hashUpdate)
      }

      this.$router.push({
        path:
          this.mode !== Mode.BROWSER
            ? '/'
            : (categoryIds ? `/${categoryIds}/` : '/') + (id ? `${id}` : ''),
        query: this.$router.currentRoute.query,
        hash,
      })
    },

    onQuitExplorerFavoriteMode() {
      this.$store.dispatch('map/setMode', Mode.BROWSER)
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
        this.setMode(Mode.EXPLORER)
        this.goToSelectedFeature()

        if (this.$screen.smallScreen) {
          this.showPoi = false
        }
      } else {
        this.allowRegionBackZoom = false
        this.setMode(Mode.BROWSER)
      }
    },

    toggleFavorite(feature?: ApiPoi) {
      try {
        this.$store.dispatch('favorite/toggleFavorite', feature)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Vido error:', e.message)
      }
    },

    setPoiVisibility(visible: boolean) {
      this.showPoi = visible
    },

    onToggleFavoritesMode() {
      if (this.favoritesIds?.length > 0) {
        this.$tracking({ type: 'map_control_event', event: 'favorite' })
        if (!this.isModeFavorites) {
          this.setMode(Mode.FAVORITES)
        } else {
          this.setMode(Mode.BROWSER)
        }
      } else {
        this.showFavoritesOverlay = true
      }
    },

    scrollTop() {
      if (this.$refs.bottomMenu) {
        this.$refs.bottomMenu.scrollTop = 0
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
          console.error('Vido error:', e.message)
        })
    },

    fetchFavorites(ids: [string]): Promise<ApiPoi[]> {
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
