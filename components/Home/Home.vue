<template>
  <div class="fixed w-full h-full overflow-hidden flex flex-col">
    <header
      class="hidden md:flex relative md:fixed top-0 bottom-0 z-10 flex flex-row w-full md:h-full space-x-4 pointer-events-none md:w-auto md:p-2"
    >
      <div
        :class="[
          'flex-col justify-between w-full w-auto max-w-md space-y-4 sm:pb-10',
          !selectedFeature && 'flex',
          showPoi && 'max-h-screen-4/6 max-h-screen 2xl:h-auto',
        ]"
      >
        <transition-group
          name="headers"
          appear
          mode="out-in"
          class="overflow-y-auto"
        >
          <ExplorerOrFavoritesBack
            v-if="isModeExplorer || isModeFavorites"
            key="ExplorerOrFavoritesBack"
            @click="onQuitExplorerFavoriteMode"
          />

          <Menu
            v-else-if="state.matches(states.Categories)"
            key="Menu"
            menu-block="MenuBlock"
            :logo-url="logoUrl"
            :main-url="mainUrl"
            :site-name="siteName"
            :menu-items="menuItems"
            :filters="filters"
            :categories-actives-count-by-parent="categoriesActivesCountByParent"
            :is-category-selected="isCategorySelected"
            @search-click="goToSearch"
            @category-click="toggleSubCategorySelection"
            @select-all-categories="selectSubCategory"
            @unselect-all-categories="unselectSubCategory"
          />

          <div
            v-else
            key="Search"
            :class="['max-h-full flex p-2', showPoi && 'max-h-screen-4/6']"
          >
            <Search
              :site-name="siteName"
              :logo-url="logoUrl"
              :main-url="mainUrl"
              :menu-to-icon="menuItemsToIcons"
              :map-center="map_center"
              @go-back-click="goToHome"
              @category-click="onSearchCategory"
              @poi-click="onSearchPoi"
              @feature-click="onFeatureClick"
            />
          </div>
        </transition-group>
      </div>

      <div
        v-if="
          !isModeExplorer && selectedSubCategories.length && !isModeFavorites
        "
        class="py-2"
        style="max-width: calc(100vw - 670px)"
      >
        <SelectedCategories
          :menu-items="selectedSubCategories"
          :is-category-selected="isCategorySelected"
          @category-unselect="unselectSubCategory"
        />
      </div>
    </header>

    <header
      class="flex md:hidden relative fidex top-0 bottom-0 z-10 flex-row w-full space-x-4 pointer-events-none"
    >
      <div :class="['w-full', isBottomMenuOpened && 'hidden']">
        <Search
          :site-name="siteName"
          :logo-url="logoUrl"
          :main-url="mainUrl"
          :menu-to-icon="menuItemsToIcons"
          :map-center="map_center"
          @go-to-categories="onQuitExplorerFavoriteMode"
          @go-back-click="goToHome"
          @category-click="onSearchCategory"
          @poi-click="onSearchPoi"
          @feature-click="onFeatureClick"
        />
      </div>
    </header>

    <div v-if="initialBbox" class="w-full h-full">
      <div
        :class="[
          'relative flex flex-col w-full h-full md:h-full',
          !isBottomMenuOpened && 'h-full',
        ]"
      >
        <MapFeatures
          ref="mapFeatures"
          :default-bounds="initialBbox"
          :fit-bounds-padding-options="fitBoundsPaddingOptions"
          :extra-attributions="settings.attributions"
          :small="isBottomMenuOpened"
          :categories="menuItems"
          :features="mapFeatures"
          :selected-feature="selectedFeature"
          :selected-categories-ids="isModeExplorer ? [] : selectedCategoriesIds"
          :style-icon-filter="(isModeExplorer && poiFilters) || null"
          @on-select-feature="setSelectedFeature($event)"
          @full-attribution="setFullAttributions($event)"
        />
        <div
          v-if="isLoadingFeatures"
          class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80"
        >
          <font-awesome-icon
            icon="spinner"
            class="text-zinc-400 animate-spin"
            size="3x"
          />
        </div>
        <div
          :class="[
            'absolute flex justify-end pointer-events-auto items-top pt-4 right-3 md:pt-0 w-40 md:w-48 top-4',
            isBottomMenuOpened && 'hidden',
          ]"
        >
          <FavoriteMenu
            :has-favorites="favoritesIds.length !== 0"
            :explore-around-selected-poi="exploreAroundSelectedPoi"
            :go-to-selected-poi="goToSelectedFeature"
            :toggle-favorite="toggleFavorite"
            @toggle-favorites="onToggleFavoritesMode"
          />
          <NavMenu
            id="nav-menu"
            :entries="navMenuEntries"
            class="ml-3 sm:ml-9"
          />
        </div>
      </div>
    </div>

    <FavoritesOverlay
      v-if="showFavoritesOverlay"
      @discard="showFavoritesOverlay = false"
    />
    <div
      class="hidden fixed inset-x-0 bottom-0 md:flex overflow-y-auto pointer-events-none h-auto md:inset-x-3 md:bottom-5"
    >
      <div class="w-full max-w-md" />
      <div class="grow-[1]" />
      <PoiCard
        v-if="selectedFeature && showPoi"
        :poi="selectedFeature"
        class="grow-0"
        @explore-click="exploreAroundSelectedPoi"
        @favorite-click="toggleFavorite($event)"
        @zoom-click="goToSelectedFeature"
      />
      <div class="grow-[3]" />
    </div>

    <BottomMenu
      class="md:hidden"
      :show-grip="
        !(isModeExplorer || isModeFavorites) || Boolean(selectedFeature)
      "
      :is-open="isBottomMenuOpened"
      @on-grip-click="onBottomMenuButtonClick"
    >
      <div class="flex-1 h-full overflow-y-auto h-screen-3/5 divide-y">
        <Menu
          v-if="!showPoi && state.matches(states.Categories)"
          menu-block="MenuBlockBottom"
          :logo-url="logoUrl"
          :main-url="mainUrl"
          :site-name="siteName"
          :menu-items="menuItems"
          :filters="filters"
          :categories-actives-count-by-parent="categoriesActivesCountByParent"
          :is-category-selected="isCategorySelected"
          @search-click="goToSearch"
          @category-click="toggleSubCategorySelection"
          @select-all-categories="selectSubCategory"
          @unselect-all-categories="unselectSubCategory"
        />
        <PoiCard
          v-else-if="selectedFeature && showPoi"
          :poi="selectedFeature"
          class="grow-0 text-left h-full"
          @explore-click="exploreAroundSelectedPoi"
          @favorite-click="toggleFavorite($event)"
          @zoom-click="goToSelectedFeature"
        />
      </div>
    </BottomMenu>
    <footer class="z-20">
      <Attribution
        v-if="!isBottomMenuOpened"
        :attributions="fullAttributions"
      />
      <CookiesConsent />
    </footer>
  </div>
</template>

<script lang="ts">
import copy from 'fast-copy'
import { FitBoundsOptions, LngLatBoundsLike } from 'maplibre-gl'
import Vue, { PropType, VueConstructor } from 'vue'
import { MetaInfo } from 'vue-meta'
import { mapGetters, mapActions } from 'vuex'
import { interpret } from 'xstate'

import ExplorerOrFavoritesBack from './ExplorerOrFavoritesBack.vue'
import {
  HomeState,
  HomeInterpreter,
  HomeEvents,
  HomeStates,
  homeMachine,
} from './Home.machine'

import Menu from '~/components/Home/Menu.vue'
import SelectedCategories from '~/components/Home/SelectedCategories.vue'
import Attribution from '~/components/MainMap/Attribution.vue'
import BottomMenu from '~/components/MainMap/BottomMenu.vue'
import FavoriteMenu from '~/components/MainMap/FavoriteMenu.vue'
import FavoritesOverlay from '~/components/MainMap/FavoritesOverlay.vue'
import MapFeatures from '~/components/MainMap/MapFeatures.vue'
import NavMenu from '~/components/MainMap/NavMenu.vue'
import PoiCard from '~/components/PoisCard/PoiCard.vue'
import Search from '~/components/Search/Search.vue'
import CookiesConsent from '~/components/UI/CookiesConsent.vue'
import { ContentEntry } from '~/lib/apiContent'
import { ApiMenuCategory, MenuItem } from '~/lib/apiMenu'
import { getPoiById, ApiPoi, getPoiByIds } from '~/lib/apiPois'
import { ApiMenuItemSearchResult } from '~/lib/apiSearch'
import { headerFromSettings, Settings } from '~/lib/apiSettings'
import { getBBoxFeature } from '~/lib/bbox'
import { LOCAL_STORAGE } from '~/store/favorite'
import { Mode, OriginEnum } from '~/utils/types'
import { FilterValue, FilterValues } from '~/utils/types-filters'
import { getHashPart, setHashParts } from '~/utils/url'
import { flattenFeatures } from '~/utils/utilities'

const interpretOptions = { devTools: false }

export default (
  Vue as VueConstructor<
    Vue & {
      $refs: {
        mapFeatures: InstanceType<typeof MapFeatures>
      }
    }
  >
).extend({
  components: {
    FavoriteMenu,
    FavoritesOverlay,
    NavMenu,
    MapFeatures,
    Search,
    SelectedCategories,
    Menu,
    BottomMenu,
    PoiCard,
    Attribution,
    CookiesConsent,
    ExplorerOrFavoritesBack,
  },

  props: {
    settings: {
      type: Object as PropType<Settings>,
      required: true,
    },
    navMenuEntries: {
      type: Array as PropType<ContentEntry[]>,
      required: true,
    },
    initialCategoryIds: {
      type: Array as PropType<number[]>,
      default: null,
    },
    initialPoi: {
      type: Object as PropType<ApiPoi>,
      default: null,
    },
  },
  data(): {
    service: HomeInterpreter
    state: HomeState
    selectedCategoriesIds: ApiMenuCategory['id'][]
    showPoi: boolean
    initialBbox: LngLatBoundsLike | null
    fullAttributions: string
    showFavoritesOverlay: boolean
    allowRegionBackZoom: boolean
    favorites: ApiPoi[] | null
  } {
    return {
      selectedCategoriesIds: [],
      service: interpret(homeMachine, interpretOptions),
      state: homeMachine.initialState,
      showPoi: false,
      initialBbox: null,
      fullAttributions: '',
      showFavoritesOverlay: false,
      allowRegionBackZoom: false,
      favorites: null,
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
      filters: 'menu/filters',
      mode: 'map/mode',
      isModeExplorer: 'map/isModeExplorer',
      isModeFavorites: 'map/isModeFavorites',
      selectedFeature: 'map/selectedFeature',
      map_center: 'map/center',
      favoritesIds: 'favorite/favoritesIds',
      isLoadingFeatures: 'menu/isLoadingFeatures',
    }),

    menuItems(): Record<ApiMenuCategory['id'], MenuItem> {
      return this.$store.getters['menu/menuItems']
    },

    events: () => HomeEvents,
    logoUrl(): string {
      return this.settings.themes[0]?.logo_url || ''
    },
    selectedSubCategories(): ApiMenuCategory[] {
      return this.selectedCategoriesIds.map(
        (selectedCategoriesId) => this.menuItems[selectedCategoriesId]
      ) as ApiMenuCategory[]
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
        this.$screen.smallScreen &&
        (this.isPoiCardVisible || this.state.matches(this.states.Categories))
      )
    },
    states: () => HomeStates,
    categoriesActivesCountByParent(): Record<ApiMenuCategory['id'], number> {
      const counts: { [id: string]: number } = {}
      this.selectedCategoriesIds.forEach((categoryId) => {
        let parentId = this.menuItems[categoryId]?.parent_id
        while (parentId) {
          counts[parentId] = (counts[parentId] || 0) + 1
          parentId = this.menuItems[parentId].parent_id
        }
      })
      return counts
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
          left: 500,
        }
      }
    },

    poiFilters(): string[][] {
      return Object.values(this.menuItems)
        .map((c) => c.category?.style_class)
        .filter((s) => s !== undefined) as string[][]
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
    state(val: HomeState, oldVal: HomeState) {
      if (val.matches(this.states.Home) && !oldVal.matches(this.states.Home)) {
        this.goToHome()
      }
    },

    selectedFeature() {
      if (!this.selectedFeature) {
        this.showPoi = false
      } else {
        this.showPoi = true
      }
      this.routerPushUrl()
    },

    selectedCategoriesIds(a, b) {
      if (a !== b) {
        this.routerPushUrl()

        this.$store.dispatch('menu/fetchFeatures', {
          apiEndpoint: this.$vidoConfig.API_ENDPOINT,
          apiProject: this.$vidoConfig.API_PROJECT,
          apiTheme: this.$vidoConfig.API_THEME,
          categoryIds: this.selectedCategoriesIds,
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

  created() {
    this.service
      .onTransition((state) => {
        this.state = state
      })
      .start()
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
      const local = localStorage.getItem(LOCAL_STORAGE.favorites)
      if (local) {
        this.setFavorites(JSON.parse(local).favorites)
      }
    }
  },

  mounted() {
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

    if (this.initialCategoryIds) {
      this.selectSubCategory(this.initialCategoryIds)
    } else if (
      typeof location !== 'undefined' &&
      !getHashPart(this.$router, 'favs')
    ) {
      const enabledCategories: ApiMenuCategory['id'][] = []

      Object.keys(this.menuItems).forEach((categoryIdString) => {
        const categoryId = parseInt(categoryIdString, 10)
        if (this.menuItems[categoryId].selected_by_default) {
          enabledCategories.push(categoryId)
        }
      })

      this.selectSubCategory(enabledCategories)
    }

    if (this.initialPoi) {
      this.setSelectedFeature(this.initialPoi)
      this.initialBbox = getBBoxFeature(this.initialPoi)
    }
    if (!this.initialBbox) {
      // @ts-ignore
      this.initialBbox = this.settings.bbox_line.coordinates
    }

    this.goToHome()
  },
  methods: {
    ...mapActions({
      applyCategoriesFilters: 'menu/applyFilters',
      setSelectedFeature: 'map/setSelectedFeature',
      setMode: 'map/setMode',
      setFavorites: 'favorite/setFavorites',
    }),
    routerPushUrl(hashUpdate: { [key: string]: string | null } = {}) {
      const categoryIds = this.selectedCategoriesIds.join(',')
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
    goToHome() {
      this.service.send(HomeEvents.GoToHome)
      if (this.$screen.smallScreen) {
        this.goToSearch()
      } else {
        this.goToMenuItems()
      }
    },
    onQuitExplorerFavoriteMode() {
      this.$store.dispatch('map/setMode', Mode.BROWSER)
      this.setSelectedFeature(null)
    },
    goToSearch() {
      this.service.send(HomeEvents.GoToSearch)
    },
    goToMenuItems() {
      this.service.send(HomeEvents.GoToCategories)
    },
    isCategorySelected(subCategoryId: ApiMenuCategory['id']) {
      return this.selectedCategoriesIds.includes(subCategoryId)
    },
    sortedUniq<T>(a: T[]): T[] {
      return [...new Set(a)].sort()
    },
    selectSubCategory(subCategoriesIds: ApiMenuCategory['id'][]) {
      this.selectedCategoriesIds = this.sortedUniq([
        ...this.selectedCategoriesIds,
        ...subCategoriesIds,
      ])
    },
    send(event: HomeEvents) {
      this.service.send(event)
    },
    toggleSubCategorySelection(categoryId: ApiMenuCategory['id']) {
      if (this.selectedCategoriesIds.includes(categoryId)) {
        this.selectedCategoriesIds = this.selectedCategoriesIds.filter(
          (id) => id !== categoryId
        )
      } else {
        this.selectedCategoriesIds = this.sortedUniq([
          ...this.selectedCategoriesIds,
          categoryId,
        ])
      }
    },
    unselectSubCategory(categoriesIds: ApiMenuCategory['id'][]) {
      this.selectedCategoriesIds = this.selectedCategoriesIds.filter(
        (categoryId) => !categoriesIds.includes(categoryId)
      )
    },

    onSearchPoi(poiId: number) {
      getPoiById(
        this.$vidoConfig.API_ENDPOINT,
        this.$vidoConfig.API_PROJECT,
        this.$vidoConfig.API_THEME,
        poiId
      ).then((poi) => {
        this.setSelectedFeature(poi).then(() => {
          this.service.send(HomeEvents.GoToCategories)
          this.$refs.mapFeatures.goToSelectedFeature()
        })
      })
    },

    onSearchCategory(newFilter: ApiMenuItemSearchResult) {
      if (newFilter.filter_property) {
        const filters = copy(this.filters[newFilter.id])
        const filter = filters.find(
          (filter: FilterValue) =>
            (filter.type === 'boolean' ||
              filter.type === 'multiselection' ||
              filter.type === 'checkboxes_list') &&
            filter.def.property === newFilter.filter_property
        )
        if (filter) {
          switch (filter?.type) {
            case 'boolean':
              if (newFilter.filter_value === true) {
                filter.filterValue = newFilter.filter_value
              }
              break
            case 'multiselection':
            case 'checkboxes_list':
              filter.filterValues = [newFilter.filter_value]
              break
          }

          this.applyCategoriesFilters({
            categoryId: newFilter.id,
            filterValues: filters,
          })
        }
      }

      this.service.send(HomeEvents.GoToCategories)
      this.$store.dispatch('map/setMode', Mode.BROWSER)
      this.selectSubCategory([newFilter.id])
    },
    onFeatureClick(feature: ApiPoi) {
      this.setSelectedFeature(feature).then(() => {
        this.service.send(HomeEvents.GoToCategories)
        this.$refs.mapFeatures.goToSelectedFeature()
      })
    },

    onBottomMenuButtonClick() {
      if (!this.isModeFavorites) {
        if (this.isBottomMenuOpened) {
          if (this.selectedFeature) {
            if (!this.isModeExplorer) {
              this.setSelectedFeature(null)
            } else {
              this.setPoiVisibility(false)
            }
          }
          this.goToHome()
        } else if (!this.isModeExplorer) {
          this.goToMenuItems()
        } else if (this.selectedFeature && !this.isPoiCardVisible) {
          this.setPoiVisibility(true)
        }
      } else if (this.selectedFeature) {
        if (!this.isModeExplorer) {
          this.setSelectedFeature(null)
        } else {
          this.setPoiVisibility(false)
        }
      }
    },

    onShowPoi(show: boolean) {
      this.showPoi = show
    },
    setFullAttributions(fullAttributions: string) {
      this.fullAttributions = fullAttributions
    },

    exploreAroundSelectedPoi(feature?: ApiPoi) {
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

    toggleFavorite(feature?: ApiPoi, isNotebook?: boolean) {
      if (feature && !isNotebook) {
        this.setSelectedFeature(feature)
      }
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

    goToSelectedFeature() {
      this.$refs.mapFeatures?.goToSelectedFeature()
    },

    handleFavorites() {
      this.fetchFavorites(this.favoritesIds)
        .then((favorites) => {
          this.favorites = favorites
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.error('Vido error:', e.message)
        })
    },

    fetchFavorites(ids: [string]): Promise<ApiPoi[]> {
      return getPoiByIds(
        this.$vidoConfig.API_ENDPOINT,
        this.$vidoConfig.API_PROJECT,
        this.$vidoConfig.API_THEME,
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

<style>
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
