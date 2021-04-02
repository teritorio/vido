<template>
  <div class="w-full h-full">
    <Map v-if="!!mapConfig" class="absolute" />

    <transition name="headers" appear>
      <MainHeader
        v-if="selectedCategoryId === null"
        :highlighted-categories="highlightedFirstLevelCategories"
        :non-highlighted-categories="nonHighlightedFirstLevelCategories"
        :on-category-click="onFirstLevelCategoryClick"
        :site-name="siteName"
      />

      <SubCategoryHeader
        v-else
        :categories="subCategoriesFromSelectedCategory"
        :is-sub-category-selected="isSubCategorySelected"
        :on-category-click="onSubLevelCategoryClick"
        :on-go-back-click="unselectCategory"
        :on-select-all-categories="selectSubCategory"
        :on-unselect-all-categories="unselectSubCategory"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'

import MainHeader from '@/components/MainHeader.vue'
import Map from '@/components/Map.vue'
import SubCategoryHeader from '@/components/SubCategoryHeader.vue'
import { Class } from '@/utils/types'

export default Vue.extend({
  components: {
    MainHeader,
    Map,
    SubCategoryHeader,
  },
  data(): {
    selectedCategoryId: string | null
  } {
    return {
      selectedCategoryId: null,
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
      getSubLevelCategoriesFromCategoryId:
        'config/getSubLevelCategoriesFromCategoryId',
      highlightedFirstLevelCategories: 'config/highlightedFirstLevelCategories',
      isSubCategorySelected: 'categories/isSubCategorySelected',
      mapConfig: 'config/map',
      nonHighlightedFirstLevelCategories:
        'config/nonHighlightedFirstLevelCategories',
      siteConfig: 'config/site',
    }),
    subCategoriesFromSelectedCategory(): Class[] {
      return this.getSubLevelCategoriesFromCategoryId(this.selectedCategoryId)
    },
    siteName() {
      return this.siteConfig?.fr?.name || ''
    },
  },
  mounted() {
    this.fetchConfigFromAPI()
  },
  methods: {
    ...mapActions({
      fetchConfigFromAPI: 'config/fetch',
      selectSubCategory: 'categories/selectSubCategory',
      toggleSubCategorySelection: 'categories/toggleSubCategorySelection',
      unselectSubCategory: 'categories/unselectSubCategory',
    }),
    onFirstLevelCategoryClick(categoryId: string) {
      this.selectedCategoryId = categoryId
    },
    onSubLevelCategoryClick(categoryId: string) {
      this.toggleSubCategorySelection(categoryId)
    },
    unselectCategory() {
      this.selectedCategoryId = null
    },
  },
})
</script>

<style>
.headers-enter-active,
.headers-leave-active {
  transition: opacity 0.2s, transform 0.2s;
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
