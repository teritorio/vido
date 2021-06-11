<template>
  <div class="fixed w-full h-full overflow-hidden">
    <Map
      v-if="isMapConfigLoaded"
      ref="map"
      :small="isBottomMenuOpened"
      @click="onMapClick"
      @change-mode="onMapChangeMode"
    />

    <header
      class="z-10 fixed top-0 bottom-0 w-full sm:w-auto flex flex-row h-full sm:p-4 space-x-4 pointer-events-none"
    >
      <div
        :class="[
          'flex-col justify-between w-full sm:w-auto sm:max-w-md space-y-4',
          selectedFeature && 'hidden sm:flex',
          !selectedFeature && 'flex',
        ]"
      >
        <transition name="headers" appear mode="out-in">
          <MainHeader
            v-if="current.matches(states.Categories) && isMenuConfigLoaded"
            :highlighted-categories="highlightedRootCategories"
            :logo-url="logoUrl"
            :non-highlighted-categories="nonHighlightedRootCategories"
            :site-name="siteName"
            :show-categories="!isModeExplorer"
            :categories-activesubs-count="subCategoriesCounts"
            @category-click="onRootCategoryClick"
            @search-click="goToSearch"
          />

          <SubCategoryHeader
            v-if="!isModeExplorer && current.matches(states.SubCategories)"
            :categories="context.selectedRootCategory.subCategories"
            :filtered-categories="filteredSubCategories"
            :is-sub-category-selected="isSubCategorySelected"
            :categories-activesubs-count="subCategoriesCounts"
            @category-click="onSubCategoryClick"
            @filter-click="onSubCategoryFilterClick"
            @go-back-click="goToParentFromSubCategory"
            @select-all-categories="selectSubCategory"
            @unselect-all-categories="unselectSubCategory"
          />

          <SubCategoryFilterHeader
            v-if="!isModeExplorer && current.matches(states.SubCategoryFilters)"
            :subcategory="subCategoryForFilter"
            :filters-values="subCategoryFilters"
            @filter-changed="onSubCategoryFilterChange"
            @go-back-click="onBackToSubCategoryClick"
          />

          <div
            v-if="current.matches(states.Search)"
            :class="['max-h-full', isBottomMenuOpened && 'hidden sm:block']"
          >
            <SearchHeader
              :site-name="siteName"
              :logo-url="logoUrl"
              :menu-to-icon="categoriesToIcons"
              @go-back-click="goToHome"
              @category-click="onSearchCategory"
              @poi-click="onSearchPoi"
              @feature-click="onFeatureClick"
            />
          </div>
        </transition>
      </div>

      <div
        v-if="!isModeExplorer && selectedSubCategories.length"
        class="hidden sm:block"
      >
        <SelectedSubCategoriesDense
          :categories="selectedSubCategories"
          :is-sub-category-selected="isSubCategorySelected"
          @category-unselect="unselectSubCategory"
        />
      </div>
    </header>

    <button
      v-if="!isModeExplorer || selectedFeature"
      v-touch:swipe.stop="onBottomMenuButtonClick"
      :class="[
        'z-0 absolute sm:hidden right-3/8 left-3/8 w-1/4 h-12 transition-all rounded-t-lg text-sm font-medium px-5 space-x-1 shadow-lg outline-none focus:outline-none bg-white text-gray-800 hover:bg-gray-100 focus-visible:bg-gray-100',
        isBottomMenuOpened && 'bottom-3/5',
        !isBottomMenuOpened && 'bottom-0',
      ]"
      @click="onBottomMenuButtonClick"
    >
      <font-awesome-icon icon="grip-lines" size="lg" />
    </button>
  </div>
</template>

<script lang="ts">
import debounce from 'lodash.debounce'
import { MapboxGeoJSONFeature } from 'maplibre-gl'
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import { interpret, Interpreter, State } from 'xstate'

import MainHeader from '@/components/MainHeader.vue'
import Map from '@/components/Map.vue'
import SearchHeader from '@/components/SearchHeader.vue'
import SelectedSubCategoriesDense from '@/components/SelectedSubCategoriesDense.vue'
import SubCategoryFilterHeader from '@/components/SubCategoryFilterHeader.vue'
import SubCategoryHeader from '@/components/SubCategoryHeader.vue'
import { getPoiById } from '@/utils/api'
import { Category, Mode, FiltreValues } from '@/utils/types'
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

export default Vue.extend({
  components: {
    MainHeader,
    Map,
    SearchHeader,
    SelectedSubCategoriesDense,
    SubCategoryHeader,
    SubCategoryFilterHeader,
  },
  data(): {
    context: HomeContext
    current: State<HomeContext, HomeEvent, HomeStateSchema>
    events: typeof HomeEvents
    service: Interpreter<HomeContext, HomeStateSchema, HomeEvent>
    states: typeof HomeStates
    previousSubCategories: Category['id'][]
  } {
    const debouncedFetchFeatures = debounce(
      (selectedSubCategoriesIds) =>
        this.$store.dispatch('menu/fetchFeatures', {
          apiEndpoint: this.$config.API_ENDPOINT,
          categoryIds: selectedSubCategoriesIds,
        }),
      500
    )

    return {
      context: homeMachine.context,
      current: homeMachine.initialState,
      events: HomeEvents,
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
      states: HomeStates,
      previousSubCategories: [],
    }
  },
  head() {
    const infos = this.siteInfos('fr')

    return {
      title: infos?.name,
      meta: [
        {
          // https://nuxtjs.org/docs/2.x/features/meta-tags-seo#local-settings
          hid: 'index',
          name: infos?.name,
          content: infos?.description,
        },
      ],
    }
  },
  computed: {
    ...mapGetters({
      getSubCategoriesFromCategoryId: 'menu/getSubCategoriesFromCategoryId',
      highlightedRootCategories: 'menu/highlightedRootCategories',
      isMapConfigLoaded: 'map/isLoaded',
      isMenuConfigLoaded: 'menu/isLoaded',
      nonHighlightedRootCategories: 'menu/nonHighlightedRootCategories',
      siteInfos: 'site/infos',
      subCategories: 'menu/subCategories',
      filters: 'menu/filters',
      mode: 'site/mode',
      selectedFeature: 'map/selectedFeature',
    }),
    logoUrl() {
      return this.siteInfos('fr')?.logo || ''
    },
    selectedSubCategories(): Category[] {
      const categories: Category[] = this.subCategories

      return categories.filter((category) =>
        this.context.selectedSubCategoriesIds.includes(category.id)
      )
    },
    siteName() {
      return this.siteInfos('fr')?.name || ''
    },
    isModeExplorer() {
      return this.mode === Mode.EXPLORER
    },
    isPoiToastVisible() {
      return (
        this.selectedFeature && this.$refs.map && this.$refs.map.showPoiToast
      )
    },
    isBottomMenuOpened() {
      return (
        this.isPoiToastVisible ||
        this.current.matches(this.states.Categories) ||
        this.current.matches(this.states.SubCategories) ||
        this.current.matches(this.states.SubCategoryFilters)
      )
    },
    rootCategories() {
      return this.highlightedRootCategories.concat(
        this.nonHighlightedRootCategories
      )
    },
    subCategoriesCounts(): { [id: string]: number } {
      const counts: { [id: string]: number } = {}
      const addCount = (cat: Category) => {
        if (counts[cat.parent]) {
          counts[cat.parent]++
        } else {
          counts[cat.parent] = 1
        }
        if (cat.parent !== '0') {
          const parent =
            this.subCategories.find((sc: Category) => sc.id === cat.parent) ||
            this.rootCategories.find((sc: Category) => sc.id === cat.parent)
          if (parent) {
            addCount(parent)
          }
        }
      }
      this.selectedSubCategories.forEach((subcategory: Category) =>
        addCount(subcategory)
      )
      return counts
    },
    subCategoryForFilter(): Category {
      return this.subCategories.find(
        (sc: Category) => sc.id === this.context.selectedSubCategoryForFilters
      )
    },
    subCategoryFilters(): FiltreValues {
      return (
        this.context.selectedSubCategoryForFilters &&
        this.filters[this.context.selectedSubCategoryForFilters]
      )
    },
    filteredSubCategories(): Category['id'][] {
      return Object.keys(this.filters)
    },
    categoriesToIcons(): { [category: Category['id']]: string } {
      const res = {}
      this.subCategories.forEach((sc) => {
        res[sc.id] = sc.metadata.picto
      })
      return res
    },
  },
  watch: {
    current(val, oldVal) {
      if (val.matches(this.states.Home) && !oldVal.matches(this.states.Home)) {
        this.goToHome()
      }
    },
    mode() {
      if (this.isModeExplorer) {
        this.unselectSubCategory(this.context.selectedSubCategoriesIds)
      }
    },
  },
  created() {
    this.service
      .onTransition((state) => {
        this.current = state
        this.context = state.context

        if (
          typeof location !== 'undefined' &&
          state.event.type !== HomeEvents.Init
        ) {
          setHashPart('cat', this.context.selectedSubCategoriesIds.join('.'))
        }
      })
      .start()
  },
  mounted() {
    if (typeof location !== 'undefined' && getHashPart('cat')) {
      this.selectSubCategory(getHashPart('cat')?.split('.') || [])
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
      if (this.context.selectedRootCategory) {
        const rootCat = this.subCategories.find(
          (sc: Category) => sc.id === this.context.selectedRootCategory?.id
        )
        if (rootCat && rootCat.level >= 2) {
          this.onRootCategoryClick(rootCat.parent)
        } else {
          this.service.send(HomeEvents.GoToCategories)
        }
      } else {
        this.service.send(HomeEvents.GoToCategories)
      }
    },
    goToSearch() {
      this.service.send(HomeEvents.GoToSearch)
    },
    goToCategories() {
      this.service.send(HomeEvents.GoToCategories)
    },
    isSubCategorySelected(subCategoryId: Category['id']) {
      return this.context.selectedSubCategoriesIds.includes(subCategoryId)
    },
    onRootCategoryClick(rootCategoryId: Category['id']) {
      this.service.send(HomeEvents.GoToSubCategories, {
        rootCategoryId,
        subCategories: this.getSubCategoriesFromCategoryId(rootCategoryId),
      })
    },
    onSubCategoryClick(categoryId: Category['id']) {
      const sc = this.subCategories.find((sc: Category) => sc.id === categoryId)
      if (sc && sc.vido_children && sc.vido_children.length > 0) {
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
        (sc: Category) => sc.id === this.context.selectedSubCategoryForFilters
      )?.parent
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
    onSubCategoryFilterChange(filters: FiltreValues) {
      if (this.context.selectedSubCategoryForFilters) {
        const newFilters = Object.assign({}, this.filters)
        if (Object.keys(filters).length > 0) {
          newFilters[this.context.selectedSubCategoryForFilters] = filters
        } else {
          delete newFilters[this.context.selectedSubCategoryForFilters]
        }
        this.setCategoriesFilters(newFilters)
      }
    },
    onSearchCategory(subcategoryId: Category['id']) {
      this.selectSubCategory([subcategoryId])
    },
    onSearchPoi(poiId: string) {
      getPoiById(this.$config.API_ENDPOINT, poiId).then((poi) => {
        if (poi) {
          this.setSelectedFeature(poi).then(() => {
            if (this.$refs.map) {
              this.$refs.map.goToSelectedPoi()
            }
          })
        }
      })
    },
    onFeatureClick(feature: MapboxGeoJSONFeature) {
      this.setSelectedFeature(null)
      if (this.$refs.map) {
        this.$refs.map.goTo(feature)
      }
    },
    onBottomMenuButtonClick() {
      if (this.isBottomMenuOpened) {
        if (this.selectedFeature) {
          if (!this.isModeExplorer) {
            this.setSelectedFeature(null)
          } else {
            this.$refs.map.setPoiToastVisibility(false)
          }
        }
        this.goToHome()
      } else if (!this.isModeExplorer) {
        this.goToCategories()
      } else if (this.selectedFeature && !this.isPoiToastVisible) {
        this.$refs.map.setPoiToastVisibility(true)
      }
    },
    onMapClick() {
      if (this.$isMobile()) {
        this.goToHome()
      }
    },
    onMapChangeMode(mode: Mode) {
      if (mode === Mode.BROWSER) {
        this.$store.dispatch('site/setMode', mode)
        this.selectSubCategory(this.previousSubCategories)
      } else if (mode === Mode.EXPLORER) {
        this.previousSubCategories = this.context.selectedSubCategoriesIds
        this.$store.dispatch('site/setMode', mode)
      }
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
