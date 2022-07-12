<template>
  <div class="fixed w-full h-full overflow-hidden flex flex-col">
    <header
      class="relative md:fixed top-0 bottom-0 z-10 flex flex-row w-full md:h-full space-x-4 pointer-events-none md:w-auto md:p-2"
    >
      <div
        :class="[
          'flex-col justify-between w-full md:w-auto md:max-w-md md:space-y-4',
          !selectedFeature && 'flex',
          showPoi && 'max-h-screen-4/6 md:max-h-screen 2xl:h-auto',
        ]"
      >
        <transition-group name="headers" appear mode="out-in">
          <MainHeader
            v-if="
              state.matches(states.Categories) ||
              isModeExplorer ||
              isModeFavorites
            "
            key="MainHeader"
            :show-poi="showPoi"
            :logo-url="logoUrl"
            :main-url="mainUrl"
            :site-name="siteName"
            :categories-activesubs-count="subCategoriesCounts"
            @category-click="onRootCategoryClick"
            @search-click="goToSearch"
            @go-to-categories="onQuitExplorerFavoriteMode"
          />

          <SubCategoryHeader
            v-if="
              !isModeExplorer &&
              !isModeFavorites &&
              state.matches(states.SubCategories)
            "
            key="SubCategoryHeader"
            class="hidden md:flex m-2"
            :categories="navigationSubCategories"
            :filters="filters"
            :is-sub-category-selected="isSubCategorySelected"
            @category-click="onSubCategoryClick"
            @filter-click="onSubCategoryFilterClick"
            @go-back-click="goToParentFromSubCategory"
            @select-all-categories="selectSubCategory"
            @unselect-all-categories="unselectSubCategory"
          />

          <SubCategoryFilterHeader
            v-if="!isModeExplorer && state.matches(states.SubCategoryFilters)"
            key="SubCategoryFilterHeader"
            class="hidden md:flex m-2"
            :subcategory-id="categoryIdFilter"
            :filters-values="subCategoryFilters"
            @go-back-click="onBackToSubCategoryClick"
          />

          <div
            v-if="state.matches(states.Search)"
            key="Search"
            :class="[
              'max-h-full hidden md:flex p-2',
              showPoi && 'max-h-screen-4/6',
            ]"
          >
            <Search
              :site-name="siteName"
              :logo-url="logoUrl"
              :menu-to-icon="categoriesToIcons"
              :map-center="map_center"
              @go-back-click="goToHome"
              @category-click="onSearchCategory"
              @poi-click="onSearchPoi"
              @feature-click="onFeatureClick"
            />
          </div>
        </transition-group>
        <div
          v-if="state.matches(states.Search)"
          :class="[
            'max-h-full md:hidden md:p-2',
            isBottomMenuOpened && 'hidden',
          ]"
        >
          <Search
            :site-name="siteName"
            :logo-url="logoUrl"
            :menu-to-icon="categoriesToIcons"
            :map-center="map_center"
            @go-to-categories="onQuitExplorerFavoriteMode"
            @go-back-click="goToHome"
            @category-click="onSearchCategory"
            @poi-click="onSearchPoi"
            @feature-click="onFeatureClick"
          />
        </div>
      </div>

      <div
        v-if="
          !isModeExplorer && selectedSubCategories.length && !isModeFavorites
        "
        class="hidden md:block py-2"
        style="max-width: calc(100vw - 670px)"
      >
        <SelectedSubCategoriesDense
          :categories="selectedSubCategories"
          :is-sub-category-selected="isSubCategorySelected"
          @category-unselect="unselectSubCategory"
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
          :categories="categories"
          :features="mapFeatures"
          :selected-feature="selectedFeature"
          :selected-categories-ids="selectedCategoriesIds"
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
          <NavMenu :entries="navMenuEntries" class="ml-3 sm:ml-9" />
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
      <MapPoiToast
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
        <div v-if="!showPoi && state.matches(states.Categories)">
          <HeaderRootCategories
            v-for="category in categoryRootCategories"
            :key="category.id"
            :category-id="category.id"
            :categories-activesubs-count="subCategoriesCounts"
            class="flex-1 pointer-events-auto px-5 py-4 h-full"
            @category-click="onRootCategoryClick"
          />
        </div>
        <SubCategoryHeader
          v-if="
            !showPoi &&
            !isModeExplorer &&
            !isModeFavorites &&
            state.matches(states.SubCategories)
          "
          class="h-full"
          :categories="navigationSubCategories"
          :filters="filters"
          :is-sub-category-selected="isSubCategorySelected"
          @category-click="onSubCategoryClick"
          @go-back-click="goToParentFromSubCategory"
          @select-all-categories="selectSubCategory"
          @unselect-all-categories="unselectSubCategory"
          @filter-click="onSubCategoryFilterClick"
        />
        <SubCategoryFilterHeader
          v-if="
            !showPoi &&
            !isModeExplorer &&
            state.matches(states.SubCategoryFilters)
          "
          class="relative text-left h-full"
          :subcategory-id="categoryIdFilter"
          :filters-values="subCategoryFilters"
          @go-back-click="onBackToSubCategoryClick"
        />
        <MapPoiToast
          v-if="selectedFeature && showPoi"
          :poi="selectedFeature"
          class="grow-0 text-left h-full"
          @explore-click="exploreAroundSelectedPoi"
          @favorite-click="toggleFavorite($event)"
          @zoom-click="goToSelectedFeature"
        />
      </div>
    </BottomMenu>
    <footer>
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

import {
  HomeState,
  HomeInterpreter,
  HomeEvents,
  HomeStates,
  homeMachine,
} from './Home.machine'

import HeaderRootCategories from '~/components/Categories/HeaderRootCategories.vue'
import SelectedSubCategoriesDense from '~/components/Categories/SelectedSubCategoriesDense.vue'
import SubCategoryFilterHeader from '~/components/Categories/SubCategoryFilterHeader.vue'
import SubCategoryHeader from '~/components/Categories/SubCategoryHeader.vue'
import Attribution from '~/components/MainMap/Attribution.vue'
import BottomMenu from '~/components/MainMap/BottomMenu.vue'
import FavoriteMenu from '~/components/MainMap/FavoriteMenu.vue'
import FavoritesOverlay from '~/components/MainMap/FavoritesOverlay.vue'
import MainHeader from '~/components/MainMap/MainHeader.vue'
import MapFeatures from '~/components/MainMap/MapFeatures.vue'
import MapPoiToast from '~/components/MainMap/MapPoiToast.vue'
import NavMenu from '~/components/MainMap/NavMenu.vue'
import Search from '~/components/Search/Search.vue'
import CookiesConsent from '~/components/UI/CookiesConsent.vue'
import { ContentEntry } from '~/lib/apiContent'
import { ApiMenuCategory, Category } from '~/lib/apiMenu'
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
    MainHeader,
    FavoriteMenu,
    FavoritesOverlay,
    NavMenu,
    MapFeatures,
    Search,
    SelectedSubCategoriesDense,
    HeaderRootCategories,
    SubCategoryHeader,
    SubCategoryFilterHeader,
    BottomMenu,
    MapPoiToast,
    Attribution,
    CookiesConsent,
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
    categoryNavigationStackIds: Category['id'][]
    selectedCategoriesIds: Category['id'][]
    categoryIdFilter: Category['id'] | null
    showPoi: boolean
    initialBbox: LngLatBoundsLike | null
    fullAttributions: string
    showFavoritesOverlay: boolean
    allowRegionBackZoom: boolean
    favorites: ApiPoi[] | null
  } {
    return {
      categoryNavigationStackIds: [],
      selectedCategoriesIds: [],
      categoryIdFilter: null,
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
      categoryRootCategories: 'menu/categoryRootCategories',
      rootCategories: 'menu/rootCategories',
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

    subCategories(): Category[] {
      return this.$store.getters['menu/subCategories']
    },
    navigationSubCategories(): Category[] {
      return this.subCategories.filter(
        (category) =>
          category.parent_id === this.categoryNavigationStackIds.at(-1)
      )
    },

    events: () => HomeEvents,
    logoUrl(): string {
      return this.settings.themes[0]?.logo_url || ''
    },
    selectedSubCategories(): Category[] {
      return this.subCategories.filter((category) =>
        this.selectedCategoriesIds.includes(category.id)
      )
    },
    siteName(): string {
      return this.settings.themes[0]?.title.fr || ''
    },
    mainUrl(): string {
      return this.settings.themes[0]?.main_url?.fr || ''
    },
    isPoiToastVisible(): boolean {
      return this.selectedFeature && this.showPoi
    },
    isBottomMenuOpened(): boolean {
      return (
        this.$screen.smallScreen &&
        (this.isPoiToastVisible ||
          this.state.matches(this.states.Categories) ||
          this.state.matches(this.states.SubCategories) ||
          this.state.matches(this.states.SubCategoryFilters))
      )
    },
    states: () => HomeStates,
    subCategoriesCounts(): Record<Category['id'], number> {
      const counts: { [id: string]: number } = {}
      this.selectedCategoriesIds.forEach((categoryId) => {
        let parentId = this.categories[categoryId]?.parent_id
        while (parentId) {
          counts[parentId] = (counts[parentId] || 0) + 1
          parentId = this.categories[parentId].parent_id
        }
      })
      return counts
    },
    subCategoryFilters(): FilterValues {
      return (
        (this.categoryIdFilter && this.filters[this.categoryIdFilter]) || []
      )
    },
    categoriesToIcons(): Record<Category['id'], string> {
      const resources: Record<Category['id'], string> = {}

      this.subCategories.forEach((sc) => {
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
          bottom: this.isPoiToastVisible ? 400 : 100,
          right: 100,
          left: 500,
        }
      }
    },
    categories(): Record<ApiMenuCategory['id'], ApiMenuCategory> {
      return this.$store.getters['menu/categories']
    },

    poiFilters(): Array<string[]> {
      return Object.values(this.categories)
        .map((c) => c.category?.style_class)
        .filter((s) => s && Array.isArray(s))
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
      const enabledCategories: Category['id'][] = []

      Object.keys(this.categories).forEach((categoryIdString) => {
        const categoryId = parseInt(categoryIdString, 10)
        if (this.categories[categoryId].selected_by_default) {
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
      const categoryIds = this.selectedCategoriesIds.sort().join(',')
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
        this.goToCategories()
      }
    },
    goToParentFromSubCategory() {
      if (this.categoryNavigationStackIds.length > 0) {
        this.categoryNavigationStackIds.pop()
        if (this.categoryNavigationStackIds.length > 0) {
          this.service.send(HomeEvents.GoToSubCategories)
        } else {
          this.service.send(HomeEvents.GoToCategories)
        }
      }
    },
    onQuitExplorerFavoriteMode() {
      this.$store.dispatch('map/setMode', Mode.BROWSER)
      this.setSelectedFeature(null)
    },
    goToSearch() {
      this.service.send(HomeEvents.GoToSearch)
    },
    goToCategories() {
      this.service.send(HomeEvents.GoToCategories)
    },
    isSubCategorySelected(subCategoryId: Category['id']) {
      return this.selectedCategoriesIds.includes(subCategoryId)
    },

    onRootCategoryClick(categoryId: Category['id']) {
      this.categoryNavigationStackIds.push(categoryId)
      this.service.send(HomeEvents.GoToSubCategories)
    },
    onSubCategoryClick(categoryId: Category['id']) {
      const sc = this.navigationSubCategories.find((sc) => sc.id === categoryId)

      if (
        sc &&
        sc?.menu_group?.vido_children &&
        sc.menu_group.vido_children.length > 0
      ) {
        this.categoryNavigationStackIds.push(categoryId)
        this.service.send(HomeEvents.GoToSubCategories)
      } else {
        this.toggleSubCategorySelection(categoryId)
      }
    },
    onSubCategoryFilterClick(categoryId: Category['id']) {
      this.categoryIdFilter = categoryId
      this.service.send(HomeEvents.GoToSubCategoryFilters)
    },
    onBackToSubCategoryClick() {
      this.service.send(HomeEvents.GoToSubCategories)
    },
    selectSubCategory(subCategoriesIds: Category['id'][]) {
      this.selectedCategoriesIds = [
        ...this.selectedCategoriesIds,
        ...subCategoriesIds,
      ]
      this.service.send(HomeEvents.SelectSubCategories)
    },
    send(event: HomeEvents) {
      this.service.send(event)
    },
    toggleSubCategorySelection(categoryId: Category['id']) {
      if (this.selectedCategoriesIds.includes(categoryId)) {
        this.selectedCategoriesIds = this.selectedCategoriesIds.filter(
          (id) => id !== categoryId
        )
      } else {
        this.selectedCategoriesIds = [...this.selectedCategoriesIds, categoryId]
      }
      this.service.send(HomeEvents.ToggleSubCategorySelection)
    },
    unselectSubCategory(categoriesIds: Category['id'][]) {
      this.selectedCategoriesIds = this.selectedCategoriesIds.filter(
        (categoryId) => !categoriesIds.includes(categoryId)
      )
      this.service.send(HomeEvents.UnselectSubCategories)
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
          this.goToCategories()
        } else if (this.selectedFeature && !this.isPoiToastVisible) {
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
