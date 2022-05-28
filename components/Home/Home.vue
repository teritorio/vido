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
            :categories="state.context.selectedRootCategory.subCategories"
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
            :subcategory="subCategoryForFilter"
            :filters-values="subCategoryFilters"
            @go-back-click="onBackToSubCategoryClick"
          />

          <div
            v-if="state.matches(states.Search)"
            key="SearchHeader"
            :class="[
              'max-h-full hidden md:flex p-2',
              showPoi && 'max-h-screen-4/6',
            ]"
          >
            <SearchHeader
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
          <SearchHeader
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
          :selected-categories="state.context.selectedSubCategoriesIds"
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
          <NavMenu class="ml-3 sm:ml-9" />
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
      <div
        v-if="!showPoi && state.matches(states.Categories)"
        class="flex-1 h-full overflow-y-auto max-h-screen-3/5 divide-y"
      >
        <HeaderRootCategories
          v-for="category in categoryRootCategories"
          :key="category.id"
          :category-id="category.id"
          :categories-activesubs-count="subCategoriesCounts"
          class="flex-1 pointer-events-auto px-5 py-4"
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
        :categories="state.context.selectedRootCategory.subCategories"
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
        class="relative min-h-screen-3/5 max-h-screen-3/5 text-left"
        :subcategory="subCategoryForFilter"
        :filters-values="subCategoryFilters"
        @go-back-click="onBackToSubCategoryClick"
      />
      <MapPoiToast
        v-if="selectedFeature && showPoi"
        :poi="selectedFeature"
        class="grow-0 text-left max-h-screen-3/5"
        @explore-click="exploreAroundSelectedPoi"
        @favorite-click="toggleFavorite($event)"
        @zoom-click="goToSelectedFeature"
      />
    </BottomMenu>
    <Attribution v-if="!isBottomMenuOpened" :attributions="fullAttributions" />
  </div>
</template>

<script lang="ts">
import copy from 'fast-copy'
import debounce from 'lodash.debounce'
import { FitBoundsOptions, LngLatBoundsLike } from 'maplibre-gl'
import Vue, { PropType, VueConstructor } from 'vue'
import { MetaInfo } from 'vue-meta'
import { mapGetters, mapActions } from 'vuex'
import { interpret, Interpreter, State } from 'xstate'

import HeaderRootCategories from '@/components/Categories/HeaderRootCategories.vue'
import SelectedSubCategoriesDense from '@/components/Categories/SelectedSubCategoriesDense.vue'
import SubCategoryFilterHeader from '@/components/Categories/SubCategoryFilterHeader.vue'
import SubCategoryHeader from '@/components/Categories/SubCategoryHeader.vue'
import Attribution from '@/components/MainMap/Attribution.vue'
import BottomMenu from '@/components/MainMap/BottomMenu.vue'
import FavoriteMenu from '@/components/MainMap/FavoriteMenu.vue'
import FavoritesOverlay from '@/components/MainMap/FavoritesOverlay.vue'
import MainHeader from '@/components/MainMap/MainHeader.vue'
import MapFeatures from '@/components/MainMap/MapFeatures.vue'
import MapPoiToast from '@/components/MainMap/MapPoiToast.vue'
import NavMenu from '@/components/MainMap/NavMenu.vue'
import SearchHeader from '@/components/Search/SearchHeader.vue'
import { ApiMenuCategory, Category } from '@/lib/apiMenu'
import { getPoiById, ApiPoi, getPoiByIds } from '@/lib/apiPois'
import { ApiMenuItemSearchResult } from '@/lib/apiSearch'
import { headerFromSettings, Settings } from '@/lib/apiSettings'
import { getBBoxFeature } from '@/lib/bbox'
import { LOCAL_STORAGE } from '@/lib/constants'
import { Mode, OriginEnum } from '@/utils/types'
import { FilterValue, FilterValues } from '@/utils/types-filters'
import { getHashPart, setHashParts } from '@/utils/url'

import {
  HomeContext,
  HomeEvent,
  HomeEvents,
  homeMachine,
  HomeStates,
  HomeStateSchema,
  HomeTypestate,
  HomeResolvedTypesMeta,
} from './Home.machine'

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
    SearchHeader,
    SelectedSubCategoriesDense,
    HeaderRootCategories,
    SubCategoryHeader,
    SubCategoryFilterHeader,
    BottomMenu,
    MapPoiToast,
    Attribution,
  },

  props: {
    settings: {
      type: Object as PropType<Settings>,
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
    service: Interpreter<
      HomeContext,
      HomeStateSchema,
      HomeEvent,
      HomeTypestate,
      HomeResolvedTypesMeta
    >
    state: State<
      HomeContext,
      HomeEvent,
      HomeStateSchema,
      HomeTypestate,
      HomeResolvedTypesMeta
    >
    previousSubCategories: Category['id'][]
    showPoi: boolean
    initialBbox: LngLatBoundsLike | null
    fullAttributions: string
    showFavoritesOverlay: boolean
    allowRegionBackZoom: boolean
    favorites: ApiPoi[] | null
  } {
    const debouncedFetchFeatures = debounce(
      (selectedSubCategoriesIds) =>
        this.$store.dispatch('menu/fetchFeatures', {
          apiEndpoint: this.$vidoConfig.API_ENDPOINT,
          apiProject: this.$vidoConfig.API_PROJECT,
          apiTheme: this.$vidoConfig.API_THEME,
          categoryIds: selectedSubCategoriesIds,
        }),
      500
    )

    return {
      previousSubCategories: [],
      service: interpret(
        homeMachine.withConfig({
          services: {
            fetchFeatures: (context: HomeContext) => {
              debouncedFetchFeatures(context.selectedSubCategoriesIds)

              return Promise.resolve()
            },
          },
        }),
        interpretOptions
      ),
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
      categories: 'menu/categories',
      categoryRootCategories: 'menu/categoryRootCategories',
      rootCategories: 'menu/rootCategories',
      getSubCategoriesFromCategoryId: 'menu/getSubCategoriesFromCategoryId',
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
    events: () => HomeEvents,
    logoUrl(): string {
      return this.settings.themes[0]?.logo_url || ''
    },
    selectedSubCategories(): Category[] {
      const categories = this.subCategories

      return categories.filter((category) =>
        this.state.context.selectedSubCategoriesIds.includes(category.id)
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
    subCategories(): Category[] {
      return this.$store.getters['menu/subCategories']
    },
    subCategoriesCounts(): Record<Category['id'], number> {
      const counts: { [id: string]: number } = {}
      const addCount = (cat: Category) => {
        if (counts[cat.parent_id || 'null']) {
          counts[cat.parent_id || 'null']++
        } else {
          counts[cat.parent_id || 'null'] = 1
        }
        if (cat.parent_id !== null) {
          const parentId =
            this.subCategories.find((sc) => sc.id === cat.parent_id) ||
            this.rootCategories.find((sc: Category) => sc.id === cat.parent_id)
          if (parentId) {
            addCount(parentId)
          }
        }
      }
      this.selectedSubCategories.forEach((subcategory: Category) =>
        addCount(subcategory)
      )
      return counts
    },
    subCategoryForFilter(): Category | undefined {
      return this.subCategories.find(
        (sc) => sc.id === this.state.context.selectedSubCategoryForFilters
      )
    },
    subCategoryFilters(): FilterValues {
      return (
        (this.state.context.selectedSubCategoryForFilters &&
          this.filters[this.state.context.selectedSubCategoryForFilters]) ||
        []
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
        return 50
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
    state(val, oldVal) {
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
    'state.context.selectedSubCategoriesIds'(a, b) {
      if (a !== b) {
        this.routerPushUrl()
      }
    },

    mode() {
      this.allowRegionBackZoom = false

      const hash: { [key: string]: string | null } = {
        mode: this.mode !== Mode.BROWSER ? this.mode : null,
      }
      switch (this.mode) {
        case Mode.BROWSER: {
          this.selectSubCategory(this.previousSubCategories)
          break
        }
        case Mode.EXPLORER: {
          this.previousSubCategories =
            this.state.context.selectedSubCategoriesIds
          this.unselectSubCategory(this.state.context.selectedSubCategoriesIds)
          break
        }
        case Mode.FAVORITES: {
          this.previousSubCategories =
            this.state.context.selectedSubCategoriesIds
          break
        }
      }
      this.routerPushUrl(hash)
    },

    favoritesIds() {
      this.handleFavorites()
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
    const favorites =
      localStorage.getItem(LOCAL_STORAGE.favorites) || '{ "favorites": [] }'

    this.toggleFavoritesMode(JSON.parse(favorites).favorites)

    const mode = getHashPart(this.$router, 'mode') || Mode.BROWSER
    this.setMode(mode)

    const favs = getHashPart(this.$router, 'favs')
    if (favs) {
      try {
        const newFavorite = favs
          .split(',')
          .map((e) => (!isNaN(Number(e)) ? Number(e) : null))
          .filter((e) => !!e)

        localStorage.setItem(
          LOCAL_STORAGE.favorites,
          JSON.stringify({ favorites: newFavorite, version: 1 })
        )
        this.toggleFavoritesMode(newFavorite)
        this.handleFavorites()
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Vido error:', e.message)
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
      toggleFavoritesMode: 'favorite/toggleFavoritesMode',
    }),
    routerPushUrl(hashUpdate: { [key: string]: string | null } = {}) {
      const categoryIds = this.state.context.selectedSubCategoriesIds
        .sort()
        .join(',')
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
      if (this.state.context.selectedRootCategory) {
        const rootCat = this.subCategories.find(
          (sc) => sc.id === this.state.context.selectedRootCategory?.id
        )

        if (rootCat && rootCat.parent_id !== null) {
          this.onRootCategoryClick(rootCat.parent_id)
        } else {
          this.service.send(HomeEvents.GoToCategories)
        }
      } else {
        this.service.send(HomeEvents.GoToCategories)
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
      return this.state.context.selectedSubCategoriesIds.includes(subCategoryId)
    },
    onRootCategoryClick(rootCategoryId: Category['id']) {
      this.service.send(HomeEvents.GoToSubCategories, {
        rootCategoryId,
        subCategories: this.getSubCategoriesFromCategoryId(rootCategoryId),
      })
    },
    onSubCategoryClick(categoryId: Category['id']) {
      const sc = this.subCategories.find((sc) => sc.id === categoryId)

      if (
        sc &&
        sc?.menu_group?.vido_children &&
        sc.menu_group.vido_children.length > 0
      ) {
        this.onRootCategoryClick(categoryId)
      } else {
        this.toggleSubCategorySelection(categoryId)
      }
    },
    onSubCategoryFilterClick(subCategoryId: Category['id']) {
      this.service.send(HomeEvents.GoToSubCategoryFilters, {
        subCategoryId,
      })
    },
    onBackToSubCategoryClick() {
      const rootCatId = this.subCategories.find(
        (sc) => sc.id === this.state.context.selectedSubCategoryForFilters
      )?.parent_id

      this.service.send(HomeEvents.GoToSubCategories, {
        rootCategoryId: rootCatId,
        subCategories: this.getSubCategoriesFromCategoryId(rootCatId),
      })
    },
    selectSubCategory(subCategoriesIds: Category['id'][]) {
      this.service.send(HomeEvents.SelectSubCategories, {
        subCategoriesIds,
      })
    },
    send(event: HomeEvents) {
      this.service.send(event)
    },
    toggleSubCategorySelection(subCategoryId: Category['id']) {
      this.service.send(HomeEvents.ToggleSubCategorySelection, {
        subCategoryId,
      })
    },
    unselectSubCategory(subCategoriesIds: Category['id'][]) {
      this.service.send(HomeEvents.UnselectSubCategories, {
        subCategoriesIds,
      })
    },
    onSearchPoi(poiId: number) {
      getPoiById(
        this.$vidoConfig.API_ENDPOINT,
        this.$vidoConfig.API_PROJECT,
        this.$vidoConfig.API_THEME,
        poiId
      ).then((poi) => {
        if (poi) {
          this.service.send(HomeEvents.GoToCategories)
          this.setSelectedFeature(poi)
        }
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
        const props = feature?.properties
        const id = props?.metadata?.id || feature?.id
        const currentFavorites = localStorage.getItem(LOCAL_STORAGE.favorites)
        let newFavorite

        if (id) {
          if (currentFavorites) {
            const parsedFavorites = JSON.parse(currentFavorites).favorites
            if (!parsedFavorites.includes(id)) {
              newFavorite = [...parsedFavorites, id]
            } else {
              newFavorite = parsedFavorites.filter(
                (f: string) => `${f}` !== `${id}`
              )
            }
          } else {
            newFavorite = [id]
          }

          localStorage.setItem(
            LOCAL_STORAGE.favorites,
            JSON.stringify({ favorites: newFavorite, version: 1 })
          )
          this.toggleFavoritesMode(newFavorite)
        }
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
      this.fetchFavorites(this.favoritesIds).then((favorites) => {
        this.favorites = favorites
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

.bottom-2\/5 {
  bottom: 40%;
}

.bottom-3\/5 {
  bottom: 60%;
}

.right-3\/8 {
  right: 37.5%;
}
.left-3\/8 {
  left: 37.5%;
}
</style>
