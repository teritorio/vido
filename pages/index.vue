<template>
  <div class="w-full h-full">
    <Map v-if="!!mapConfig" class="absolute" />

    <header
      class="fixed top-0 bottom-0 flex flex-col w-full h-full max-w-md p-4 space-y-4 pointer-events-none"
    >
      <transition name="headers" appear mode="out-in">
      <MainHeader
          v-if="current.matches(mainStates.Main)"
        :highlighted-categories="highlightedSuperCategories"
        :non-highlighted-categories="nonHighlightedSuperCategories"
        :on-category-click="onSuperCategoryClick"
        :on-search-click="goToSearch"
        :site-name="siteName"
      />

      <SubCategoryHeader
        v-if="current.matches(mainStates.SubCategories)"
        :categories="context.selectedSuperCategory.subCategories"
        :is-sub-category-selected="isSubCategorySelected"
        :on-category-click="onSubCategoryClick"
          :on-go-back-click="goToMain"
        :on-select-all-categories="selectSubCategory"
        :on-unselect-all-categories="unselectSubCategory"
      />

      <SearchHeader
        v-if="current.matches(mainStates.Search)"
          :on-go-back-click="goToMain"
      />
    </transition>
    </header>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import { interpret, Interpreter, State } from 'xstate'

import MainHeader from '@/components/MainHeader.vue'
import Map from '@/components/Map.vue'
import SearchHeader from '@/components/SearchHeader.vue'
import SubCategoryHeader from '@/components/SubCategoryHeader.vue'
import {
  MainContext,
  MainEvent,
  MainEvents,
  mainMachine,
  MainStates,
  MainStateSchema,
} from '@/machines/main.machine'

import { Category } from '~/utils/types'

export default Vue.extend({
  components: {
    MainHeader,
    Map,
    SearchHeader,
    SubCategoryHeader,
  },
  data(): {
    context: MainContext
    current: State<MainContext, MainEvent, MainStateSchema>
    mainEvents: typeof MainEvents
    mainService: Interpreter<MainContext, MainStateSchema, MainEvent>
    mainStates: typeof MainStates
  } {
    return {
      context: mainMachine.context,
      current: mainMachine.initialState,
      mainEvents: MainEvents,
      mainService: interpret(mainMachine, { devTools: true }),
      mainStates: MainStates,
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
      mapConfig: 'config/map',
      nonHighlightedSuperCategories: 'config/nonHighlightedSuperCategories',
      siteConfig: 'config/site',
    }),
    siteName() {
      return this.siteConfig?.fr?.name || ''
    },
  },
  created() {
    this.mainService
      .onTransition((state) => {
        this.current = state
        this.context = state.context
      })
      .start()
  },
  mounted() {
    this.fetchConfigFromAPI()
  },
  methods: {
    ...mapActions({
      fetchConfigFromAPI: 'config/fetch',
    }),
    goToMain() {
      this.mainService.send(MainEvents.GoToMain)
    },
    goToSearch() {
      this.mainService.send(MainEvents.GoToSearch)
    },
    isSubCategorySelected(subCategoryId: Category['id']) {
      return this.context.selectedSubCategoriesIds.includes(subCategoryId)
    },
    onSuperCategoryClick(superCategoryId: string) {
      this.mainService.send(MainEvents.GoToSubCategories, {
        subCategories: this.getSubCategoriesFromCategoryId(superCategoryId),
        superCategoryId,
      })
    },
    onSubCategoryClick(categoryId: string) {
      this.toggleSubCategorySelection(categoryId)
    },
    selectSubCategory(subCategoriesIds: Category['id'][]) {
      this.mainService.send(MainEvents.SelectSubCategories, {
        subCategoriesIds,
      })
    },
    send(event: MainEvents) {
      this.mainService.send(event)
    },
    toggleSubCategorySelection(subCategoryId: Category['id']) {
      this.mainService.send(MainEvents.ToggleSubCategorySelection, {
        subCategoryId,
      })
    },
    unselectSubCategory(subCategoriesIds: Category['id'][]) {
      this.mainService.send(MainEvents.UnselectSubCategories, {
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
