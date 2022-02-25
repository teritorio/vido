<template>
  <div class="fixed w-full h-full overflow-hidden flex flex-col">
    <header
      class="relative sm:fixed top-0 bottom-0 z-10 flex flex-row w-full sm:h-full space-x-4 pointer-events-none sm:w-auto sm:p-2"
    >
      <div
        :class="[
          'flex-col justify-between w-full sm:w-auto sm:max-w-md sm:space-y-4',
          !selectedFeature && 'flex',
          showPoi && 'max-h-screen-4/6 md:max-h-screen 2xl:h-auto',
        ]"
      >
        <transition name="headers" appear mode="out-in">
          <MainHeader
            v-if="
              (state.matches(states.Categories) && isMenuConfigLoaded) ||
              isModeExplorer ||
              isModeFavorite
            "
            :show-poi="showPoi"
            :logo-url="logoUrl"
            :main-url="mainUrl"
            :site-name="siteName"
            :is-explorer-favorite="isModeExplorer || isModeFavorite"
            :show-categories="!isModeExplorer && !isModeFavorite"
            :is-favorite="isModeFavorite"
            :categories-activesubs-count="subCategoriesCounts"
            @category-click="onRootCategoryClick"
            @search-click="goToSearch"
            @go-to-categories="onQuitExplorerFavoriteMode"
          />

          <SubCategoryHeader
            v-if="
              !isModeExplorer &&
              !isModeFavorite &&
              state.matches(states.SubCategories)
            "
            class="hidden sm:flex m-2"
            :categories="state.context.selectedRootCategory.subCategories"
            :filtered-categories="filteredSubCategories"
            :is-sub-category-selected="isSubCategorySelected"
            @category-click="onSubCategoryClick"
            @filter-click="onSubCategoryFilterClick"
            @go-back-click="goToParentFromSubCategory"
            @select-all-categories="selectSubCategory"
            @unselect-all-categories="unselectSubCategory"
          />

          <SubCategoryFilterHeader
            v-if="!isModeExplorer && state.matches(states.SubCategoryFilters)"
            class="hidden sm:flex m-2"
            :subcategory="subCategoryForFilter"
            :filters-values="subCategoryFilters"
            @filter-changed="onSubCategoryFilterChange"
            @go-back-click="onBackToSubCategoryClick"
          />

          <div
            v-if="state.matches(states.Search)"
            :class="[
              'max-h-full hidden sm:flex p-2',
              showPoi && 'max-h-screen-4/6',
            ]"
          >
            <SearchHeader
              :site-name="siteName"
              :logo-url="logoUrl"
              :menu-to-icon="categoriesToIcons"
              :is-explorer-favorite="isModeExplorer || isModeFavorite"
              :map-center="map_center"
              @go-back-click="goToHome"
              @category-click="onSearchCategory"
              @poi-click="onSearchPoi"
              @feature-click="onFeatureClick"
            />
          </div>
        </transition>
        <div
          v-if="state.matches(states.Search)"
          :class="[
            'max-h-full sm:hidden sm:p-2',
            isBottomMenuOpened && 'hidden',
          ]"
        >
          <SearchHeader
            :site-name="siteName"
            :logo-url="logoUrl"
            :menu-to-icon="categoriesToIcons"
            :is-explorer-favorite="isModeExplorer || isModeFavorite"
            :is-favorite="isModeFavorite"
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
          !isModeExplorer && selectedSubCategories.length && !isModeFavorite
        "
        class="hidden sm:block py-2"
        style="max-width: calc(100vw - 670px)"
      >
        <SelectedSubCategoriesDense
          :categories="selectedSubCategories"
          :is-sub-category-selected="isSubCategorySelected"
          @category-unselect="unselectSubCategory"
        />
      </div>
    </header>
    <MainMap
      v-if="initialBbox"
      ref="mainMap"
      :default-bounds="initialBbox"
      :small="isBottomMenuOpened"
      :selected-categories="state.context.selectedSubCategoriesIds"
      :get-sub-category="selectSubCategory"
      :is-explorer-favorite="isModeExplorer || isModeFavorite"
      @click="onMapClick"
      @change-mode="onMapChangeMode"
      @show-poi="onShowPoi"
    />
    <BottomMenu
      class="sm:hidden"
      :selected-feature="selectedFeature"
      :is-mode-explorer="isModeExplorer"
      :is-bottom-menu-opened="isBottomMenuOpened"
      :show-poi="showPoi"
      :states="states"
      :state="state"
      :is-menu-config-loaded="isMenuConfigLoaded"
      :is-mode-favorite="isModeFavorite"
      :categories-activesubs-count="subCategoriesCounts"
      :categories="
        state.context.selectedRootCategory
          ? state.context.selectedRootCategory.subCategories
          : []
      "
      :subcategory="subCategoryForFilter"
      :filters-values="subCategoryFilters"
      :filtered-categories="filteredSubCategories"
      :is-sub-category-selected="isSubCategorySelected"
      :on-bottom-menu-button-click="onBottomMenuButtonClick"
      :on-go-back-click="goToParentFromSubCategory"
      :on-select-all-categories="selectSubCategory"
      :on-unselect-all-categories="unselectSubCategory"
      :on-filter-click="onSubCategoryFilterClick"
      :on-filter-changed="onSubCategoryFilterChange"
      :on-go-back-click-filter="onBackToSubCategoryClick"
      @category-click="onRootCategoryClick"
      @sub-category-click="onSubCategoryClick"
      @exploreAroundSelectedPoi="
        $refs.mainMap && $refs.mainMap.exploreAroundSelectedPoi()
      "
      @toggleFavoriteMode="
        $refs.mainMap && $refs.mainMap.toggleFavoriteMode($event)
      "
      @goToSelectedPoi="$refs.mainMap && $refs.mainMap.goToSelectedPoi()"
    />
  </div>
</template>

<script lang="ts">
import debounce from 'lodash.debounce'
import { LngLatBoundsLike } from 'maplibre-gl'
import Vue, { PropType, VueConstructor } from 'vue'
import { mapGetters, mapActions } from 'vuex'
import { interpret, Interpreter, State } from 'xstate'

import SelectedSubCategoriesDense from '@/components/Categories/SelectedSubCategoriesDense.vue'
import SubCategoryFilterHeader from '@/components/Categories/SubCategoryFilterHeader.vue'
import SubCategoryHeader from '@/components/Categories/SubCategoryHeader.vue'
import BottomMenu from '@/components/MainMap/BottomMenu.vue'
import MainHeader from '@/components/MainMap/MainHeader.vue'
import MainMap from '@/components/MainMap/MainMap.vue'
import SearchHeader from '@/components/Search/SearchHeader.vue'
import { Category } from '@/lib/apiMenu'
import { getPoiById, ApiPoi } from '@/lib/apiPois'
import { Settings } from '@/lib/apiSettings'
import { getBBoxFeature } from '@/lib/bbox'
import { Mode, FilterValues, ApiMenuItemSearchResult } from '@/utils/types'
import { getHashPart, setHashPart } from '@/utils/url'

import {
  HomeContext,
  HomeEvent,
  HomeEvents,
  homeMachine,
  HomeStates,
  HomeStateSchema,
} from './Home.machine'

const interpretOptions = { devTools: false }

// if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
//   const { inspect } = require('@xstate/inspect')
//   inspect({ iframe: false })
//   interpretOptions.devTools = true
// }

export default (Vue as VueConstructor<
  Vue & {
    $refs: {
      mainMap: InstanceType<typeof MainMap> | null
    }
  }
>).extend({
  components: {
    MainHeader,
    MainMap,
    SearchHeader,
    SelectedSubCategoriesDense,
    SubCategoryHeader,
    SubCategoryFilterHeader,
    BottomMenu,
  },
  props: {
    settings: {
      type: Object as PropType<Settings>,
      required: true,
    },
  },
  data(): {
    service: Interpreter<HomeContext, HomeStateSchema, HomeEvent>
    state: State<HomeContext, HomeEvent, HomeStateSchema>
    previousSubCategories: Category['id'][]
    showPoi: boolean
    initialBbox: LngLatBoundsLike | null
  } {
    const debouncedFetchFeatures = debounce(
      (selectedSubCategoriesIds) =>
        this.$store.dispatch('menu/fetchFeatures', {
          apiEndpoint: this.$config.API_ENDPOINT,
          apiProject: this.$config.API_PROJECT,
          apiTheme: this.$config.API_THEME,
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
    }
  },
  head() {
    const infos = this.settings

    return {
      title: infos.themes[0]?.title.fr,
      meta: [
        {
          // https://nuxtjs.org/docs/2.x/features/meta-tags-seo#local-settings
          hid: 'index',
          name: infos.themes[0]?.title?.fr,
          content: infos.themes[0]?.description?.fr,
        },
      ],
    }
  },
  computed: {
    ...mapGetters({
      categories: 'menu/categories',
      rootCategories: 'menu/rootCategories',
      getSubCategoriesFromCategoryId: 'menu/getSubCategoriesFromCategoryId',
      isMenuConfigLoaded: 'menu/isLoaded',
      filters: 'menu/filters',
      mode: 'map/mode',
      selectedFeature: 'map/selectedFeature',
      map_center: 'map/center',
      isModeFavorite: 'favorite/isModeFavorite',
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
      return this.settings.themes[0]?.main_url.fr || ''
    },
    isModeExplorer(): boolean {
      return this.mode === Mode.EXPLORER
    },
    isPoiToastVisible(): boolean {
      return this.selectedFeature && this.$refs.mainMap?.showPoiToast
    },
    isBottomMenuOpened(): boolean {
      return (
        this.isPoiToastVisible ||
        this.state.matches(this.states.Categories) ||
        this.state.matches(this.states.SubCategories) ||
        this.state.matches(this.states.SubCategoryFilters)
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
        this.state.context.selectedSubCategoryForFilters &&
        this.filters[this.state.context.selectedSubCategoryForFilters]
      )
    },
    filteredSubCategories(): Category['id'][] {
      return Object.keys(this.filters).map((i) => parseInt(i, 10))
    },
    categoriesToIcons(): Record<Category['id'], string> {
      const resources: Record<Category['id'], string> = {}

      this.subCategories.forEach((sc) => {
        resources[sc.id] = (sc.menu_group || sc.link || sc.category).icon
      })

      return resources
    },
  },
  watch: {
    state(val, oldVal) {
      if (val.matches(this.states.Home) && !oldVal.matches(this.states.Home)) {
        this.goToHome()
      }
      if (
        val.matches(this.states.SubCategoryFilters) ||
        val.matches(this.states.SubCategories) ||
        val.matches(this.states.Categories)
      ) {
        this.$refs.mainMap?.resizeMap()
      }
    },
    mode() {
      if (this.isModeExplorer) {
        this.unselectSubCategory(this.state.context.selectedSubCategoriesIds)
      }
    },
    showPoi(val) {
      if (this.$isMobile() && val) {
        this.$refs.mainMap?.resizeMap()
      }
    },
    selectedFeature(val) {
      if (this.$isMobile() && val) {
        this.$refs.mainMap?.resizeMap()
      }
    },
  },
  created() {
    this.service
      .onTransition((state) => {
        this.state = state

        if (
          typeof location !== 'undefined' &&
          state.event.type !== HomeEvents.Init
        ) {
          setHashPart(
            'cat',
            this.state.context.selectedSubCategoriesIds.join('.')
          )
        }
      })
      .start()
  },
  mounted() {
    if (typeof location !== 'undefined') {
      if (getHashPart('cat')) {
        this.selectSubCategory(
          getHashPart('cat')
            ?.split('.')
            .map((i) => parseInt(i, 10)) || []
        )
      } else if (!getHashPart('favs')) {
        const enabledCategories: Category['id'][] = []

        Object.keys(this.categories).forEach((categoryIdString) => {
          const categoryId = parseInt(categoryIdString, 10)
          if (this.categories[categoryId].selected_by_default) {
            enabledCategories.push(categoryId)
          }
        })

        this.selectSubCategory(enabledCategories)
      }

      const poiId = getHashPart('poi')
      if (poiId) {
        getPoiById(
          this.$config.API_ENDPOINT,
          this.$config.API_PROJECT,
          this.$config.API_THEME,
          poiId,
          {
            as_point: false,
          }
        ).then((poi) => {
          if (poi) {
            this.initialBbox = getBBoxFeature(poi)
          }
          if (!this.initialBbox) {
            // @ts-ignore
            this.initialBbox = this.settings.bbox_line.coordinates
          }
        })
      } else {
        // @ts-ignore
        this.initialBbox = this.settings.bbox_line.coordinates
      }
    }

    this.goToHome()
  },
  methods: {
    ...mapActions({
      setCategoriesFilters: 'menu/setFilters',
      setSelectedFeature: 'map/selectFeature',
    }),
    goToHome() {
      this.service.send(HomeEvents.GoToHome)
      if (this.$isMobile()) {
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
      this.onMapChangeMode(Mode.BROWSER)
      setHashPart('fav', null)
      this.$store.dispatch('favorite/handleFavoriteLayer', false)
      this.$store.dispatch('favorite/setFavoritesAction', 'close')
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
    onSubCategoryFilterChange(filters: FilterValues) {
      if (this.state.context.selectedSubCategoryForFilters) {
        const newFilters = Object.assign({}, this.filters)
        if (Object.keys(filters).length > 0) {
          newFilters[this.state.context.selectedSubCategoryForFilters] = filters
        } else {
          delete newFilters[this.state.context.selectedSubCategoryForFilters]
        }
        this.setCategoriesFilters(newFilters)
      }
    },
    onSearchPoi(poiId: number) {
      getPoiById(
        this.$config.API_ENDPOINT,
        this.$config.API_PROJECT,
        this.$config.API_THEME,
        poiId
      ).then((poi) => {
        if (poi) {
          this.service.send(HomeEvents.GoToCategories)
          this.setSelectedFeature(poi).then(() => {
            if (this.$refs.mainMap) {
              this.$refs.mainMap.goToSelectedPoi()
            }
          })
        }
      })
    },
    onSearchCategory(newFilter: ApiMenuItemSearchResult) {
      if (newFilter.filter_property) {
        const newFilters = Object.assign({}, this.filters)

        newFilters[`${newFilter.id}`] = {
          [newFilter.filter_property]: [
            `${newFilter.filter_value}`,
            ...(newFilters[`${newFilter.id}`]?.[newFilter.filter_property] ||
              []),
          ],
        }

        this.setCategoriesFilters(newFilters)
      }

      this.service.send(HomeEvents.GoToCategories)
      setHashPart('fav', null)
      this.$store.dispatch('favorite/handleFavoriteLayer', false)
      this.$store.dispatch('favorite/setFavoritesAction', 'close')
      this.selectSubCategory([newFilter.id])
    },
    onFeatureClick(feature: ApiPoi) {
      this.setSelectedFeature(feature).then(() => {
        this.service.send(HomeEvents.GoToCategories)

        this.$refs.mainMap?.goToSelectedPoi()
      })
    },
    onBottomMenuButtonClick() {
      if (!this.isModeFavorite) {
        if (this.isBottomMenuOpened) {
          if (this.selectedFeature) {
            if (!this.isModeExplorer) {
              this.setSelectedFeature(null)
            } else {
              this.$refs.mainMap?.setPoiToastVisibility(false)
            }
          }
          this.goToHome()
        } else if (!this.isModeExplorer) {
          this.goToCategories()
        } else if (this.selectedFeature && !this.isPoiToastVisible) {
          this.$refs.mainMap?.setPoiToastVisibility(true)
        }
      } else if (this.selectedFeature) {
        if (!this.isModeExplorer) {
          this.setSelectedFeature(null)
        } else {
          this.$refs.mainMap?.setPoiToastVisibility(false)
        }
      }
    },
    onMapClick(): void {
      if (this.$isMobile()) {
        this.goToHome()
      }
    },
    onMapChangeMode(mode: Mode) {
      if (mode === Mode.BROWSER) {
        this.$store.dispatch('map/setMode', mode)
        this.selectSubCategory(this.previousSubCategories)
      } else if (mode === Mode.EXPLORER) {
        this.previousSubCategories = this.state.context.selectedSubCategoriesIds
        this.$store.dispatch('map/setMode', mode)
      }
    },
    onShowPoi(show: boolean) {
      this.showPoi = show
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
