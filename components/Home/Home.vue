<template>
  <div class="w-full h-full">
    <Map v-if="isMapConfigLoaded" class="absolute" />

    <header
      class="fixed top-0 bottom-0 flex flex-col justify-between w-full h-full max-w-md p-4 space-y-4 pointer-events-none"
    >
      <transition name="headers" appear mode="out-in">
        <MainHeader
          v-if="current.matches(states.Home)"
          :highlighted-categories="highlightedSuperCategories"
          :non-highlighted-categories="nonHighlightedSuperCategories"
          :site-name="siteName"
          @category-click="onSuperCategoryClick"
          @search-click="goToSearch"
        />

        <SubCategoryHeader
          v-if="current.matches(states.SubCategories)"
          :categories="context.selectedSuperCategory.subCategories"
          :is-sub-category-selected="isSubCategorySelected"
          @category-click="onSubCategoryClick"
          @go-back-click="goToHome"
          @select-all-categories="selectSubCategory"
          @unselect-all-categories="unselectSubCategory"
        />

        <SearchHeader
          v-if="current.matches(states.Search)"
          @go-back-click="goToHome"
        />
      </transition>

      <SelectedSubCategoriesAside
        v-if="selectedSubCategories.length"
        :categories="selectedSubCategories"
        :is-sub-category-selected="isSubCategorySelected"
      />
    </header>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { interpret, Interpreter, State } from 'xstate'

import MainHeader from '@/components/MainHeader.vue'
import Map from '@/components/Map.vue'
import SearchHeader from '@/components/SearchHeader.vue'
import SelectedSubCategoriesAside from '@/components/SelectedSubCategoriesAside.vue'
import SubCategoryHeader from '@/components/SubCategoryHeader.vue'
import { Category } from '@/utils/types'

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
    SelectedSubCategoriesAside,
    SubCategoryHeader,
  },
  data(): {
    context: HomeContext
    current: State<HomeContext, HomeEvent, HomeStateSchema>
    events: typeof HomeEvents
    service: Interpreter<HomeContext, HomeStateSchema, HomeEvent>
    states: typeof HomeStates
  } {
    return {
      context: homeMachine.context,
      current: homeMachine.initialState,
      events: HomeEvents,
      service: interpret(homeMachine, interpretOptions),
      states: HomeStates,
    }
  },
  head() {
    return {
      title: this.siteConfig?.fr?.name,
      meta: [
        {
          // https://nuxtjs.org/docs/2.x/features/meta-tags-seo#local-settings
          hid: 'index',
          name: this.siteConfig?.fr?.name,
          content: this.siteConfig?.fr?.description,
        },
      ],
    }
  },
  computed: {
    ...mapGetters({
      getSubCategoriesFromCategoryId: 'config/getSubCategoriesFromCategoryId',
      highlightedSuperCategories: 'config/highlightedSuperCategories',
      isMapConfigLoaded: 'map/isLoaded',
      nonHighlightedSuperCategories: 'config/nonHighlightedSuperCategories',
      siteConfig: 'config/site',
      subCategories: 'config/subCategories',
    }),
    selectedSubCategories(): Category[] {
      const categories: Category[] = this.subCategories

      return categories.filter((category) =>
        this.context.selectedSubCategoriesIds.includes(category.id)
      )
    },
    siteName() {
      return this.siteConfig?.fr?.name || ''
    },
  },
  created() {
    this.service
      .onTransition((state) => {
        this.current = state
        this.context = state.context
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
    onSuperCategoryClick(superCategoryId: Category['id']) {
      this.service.send(HomeEvents.GoToSubCategories, {
        subCategories: this.getSubCategoriesFromCategoryId(superCategoryId),
        superCategoryId,
      })
    },
    onSubCategoryClick(categoryId: Category['id']) {
      this.toggleSubCategorySelection(categoryId)
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
