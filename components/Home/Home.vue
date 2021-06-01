<template>
  <div class="fixed w-full h-full overflow-hidden">
    <Map v-if="isMapConfigLoaded" class="absolute" />

    <header
      class="fixed top-0 bottom-0 flex flex-row w-full h-full p-4 space-x-4 pointer-events-none"
    >
      <div class="flex flex-col justify-between max-w-md space-y-4">
        <transition name="headers" appear mode="out-in">
          <MainHeader
            v-if="current.matches(states.Home) && isMenuConfigLoaded"
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
            :is-sub-category-selected="isSubCategorySelected"
            @category-click="onSubCategoryClick"
            @filter-click="onSubCategoryFilterClick"
            @go-back-click="goToHome"
            @select-all-categories="selectSubCategory"
            @unselect-all-categories="unselectSubCategory"
          />

          <SubCategoryFilterHeader
            v-if="!isModeExplorer && current.matches(states.SubCategoryFilters)"
            :subcategory="subCategoryForFilter"
            @go-back-click="onBackToSubCategoryClick"
          />

          <SearchHeader
            v-if="current.matches(states.Search)"
            @go-back-click="goToHome"
          />
        </transition>
      </div>

      <div>
        <SelectedSubCategoriesDense
          v-if="!isModeExplorer && selectedSubCategories.length"
          :categories="selectedSubCategories"
          :is-sub-category-selected="isSubCategorySelected"
          @category-unselect="unselectSubCategory"
        />
      </div>
    </header>
  </div>
</template>

<script lang="ts">
import debounce from 'lodash.debounce'
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { interpret, Interpreter, State } from 'xstate'

import MainHeader from '@/components/MainHeader.vue'
import Map from '@/components/Map.vue'
import SearchHeader from '@/components/SearchHeader.vue'
import SelectedSubCategoriesDense from '@/components/SelectedSubCategoriesDense.vue'
import SubCategoryFilterHeader from '@/components/SubCategoryFilterHeader.vue'
import SubCategoryHeader from '@/components/SubCategoryHeader.vue'
import { Category, Mode } from '@/utils/types'
import { setHashPart } from '@/utils/url'

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
      mode: 'site/mode',
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
    rootCategories() {
      return this.highlightedRootCategories.concat(
        this.nonHighlightedRootCategories
      )
    },
    subCategoriesCounts(): { [id: string]: number } {
      const counts: { [id: string]: number } = {}
      this.rootCategories.forEach((rootCategory: Category) => {
        counts[rootCategory.id] = this.selectedSubCategories.filter(
          (subcategory) => subcategory.parent === rootCategory.id
        ).length
      })
      return counts
    },
    subCategoryForFilter(): Category {
      return this.subCategories.find(
        (sc: Category) => sc.id === this.context.selectedSubCategoryForFilters
      )
    },
  },
  created() {
    this.service
      .onTransition((state) => {
        this.current = state
        this.context = state.context

        if (typeof location !== 'undefined') {
          setHashPart('cat', this.context.selectedSubCategoriesIds.join('.'))
        }
      })
      .start()
  },
  methods: {
    goToHome() {
      this.service.send(HomeEvents.GoToHome)
    },
    goToSearch() {
      this.service.send(HomeEvents.GoToSearch)
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
      this.toggleSubCategorySelection(categoryId)
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
</style>
