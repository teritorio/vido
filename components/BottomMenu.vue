<template>
  <div class="z-0 relative flex-shrink-0 sm:hidden text-center bottom-0 w-full">
    <button
      v-if="!isModeExplorer || selectedFeature"
      v-touch:swipe.stop="onBottomMenuButtonClick"
      class="-top-12 z-0 absolute sm:hidden right-3/8 left-3/8 w-1/4 h-12 transition-all rounded-t-lg text-sm font-medium px-5 space-x-1 shadow-lg outline-none focus:outline-none bg-white text-gray-800 hover:bg-gray-100 focus-visible:bg-gray-100"
      @click="onBottomMenuButtonClick"
    >
      <font-awesome-icon icon="grip-lines" size="lg" />
    </button>
    <div
      v-if="isBottomMenuOpened"
      class="relative justify-between w-full bg-white shadow-md pointer-events-auto h-auto"
    >
      <transition name="headers" appear mode="out-in">
        <div
          v-if="
            !showPoi && state.matches(states.Categories) && isMenuConfigLoaded
          "
          class="flex-1 h-full overflow-y-auto max-h-screen-3/5 divide-y"
        >
          <HeaderRootCategories
            v-for="category in categoryRootCategories"
            :key="category.id"
            :category-id="category.id"
            class="flex-1 pointer-events-auto px-5 py-4"
            v-bind="$attrs"
            @category-click="onCategoryClick"
          />
        </div>
        <SubCategoryHeader
          v-if="
            !showPoi &&
            !isModeExplorer &&
            !isModeFavorite &&
            state.matches(states.SubCategories)
          "
          v-bind="$attrs"
          @category-click="onSubCategoryClick"
          @go-back-click="onGoBackClick"
          @select-all-categories="onSelectAllCategories"
          @unselect-all-categories="onUnselectAllCategories"
          @filter-click="onFilterClick"
        />

        <SubCategoryFilterHeader
          v-if="
            !showPoi &&
            !isModeExplorer &&
            state.matches(states.SubCategoryFilters)
          "
          class="relative min-h-screen-3/5 max-h-screen-3/5 text-left"
          v-bind="$attrs"
          @filter-changed="onFilterChanged"
          @go-back-click="onGoBackClickFilter"
        />
        <MapPoiToast
          v-if="selectedFeature && showPoi"
          :poi="selectedFeature"
          class="flex-grow-0 text-left max-h-screen-3/5"
          @explore-click="exploreAroundSelectedPoi"
          @favorite-click="toggleFavoriteMode"
          @zoom-click="goToSelectedPoi"
        />
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters } from 'vuex'

import HeaderRootCategories from '@/components/HeaderRootCategories.vue'
import { MapRef } from '@/components/MainMap.vue'
import MapPoiToast from '@/components/MapPoiToast.vue'
import SubCategoryFilterHeader from '@/components/SubCategoryFilterHeader.vue'
import SubCategoryHeader from '@/components/SubCategoryHeader.vue'
import { Category, VidoFeature } from '@/utils/types'

import {
  HomeContext,
  HomeEvent,
  HomeStates,
  HomeStateSchema,
} from './Home/Home.machine'

export default Vue.extend({
  components: {
    HeaderRootCategories,
    SubCategoryHeader,
    SubCategoryFilterHeader,
    MapPoiToast,
  },
  props: {
    selectedFeature: {
      type: Object as PropType<VidoFeature>,
      default: null,
    },
    states: {
      type: Object as PropType<HomeStates>,
      default: {},
    },
    isModeExplorer: Boolean,
    isBottomMenuOpened: Boolean,
    showPoi: Boolean,
    isMenuConfigLoaded: Boolean,
    isModeFavorite: Boolean,
    map: {
      type: Object as PropType<MapRef>,
      default: undefined,
    },
    state: {
      type: Object as PropType<HomeContext | HomeEvent | HomeStateSchema>,
      default: undefined,
    },
    onBottomMenuButtonClick: {
      type: Function,
    },
    onGoBackClick: {
      type: Function,
    },
    onSelectAllCategories: {
      type: Function,
    },
    onUnselectAllCategories: {
      type: Function,
    },
    onFilterClick: {
      type: Function,
    },
    onFilterChanged: {
      type: Function,
    },
    onGoBackClickFilter: {
      type: Function,
    },
  },
  computed: {
    ...mapGetters({
      categoryRootCategories: 'menu/categoryRootCategories',
    }),
  },
  methods: {
    onCategoryClick(categoryId: Category['id']) {
      this.$emit('category-click', categoryId)
    },
    onSubCategoryClick(categoryId: Category['id']) {
      this.$emit('sub-category-click', categoryId)
    },
    exploreAroundSelectedPoi() {
      this.map.exploreAroundSelectedPoi()
    },
    toggleFavoriteMode(feature?: VidoFeature) {
      this.map.toggleFavoriteMode(feature)
    },
    goToSelectedPoi() {
      this.map.goToSelectedPoi()
    },
  },
})
</script>
