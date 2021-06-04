<template>
  <aside
    class="flex flex-col px-5 py-4 space-y-6 bg-white shadow-md pointer-events-auto rounded-xl max-h-full"
  >
    <div class="flex justify-between">
      <button
        type="button"
        class="flex items-center justify-center w-10 h-10 text-2xl font-bold transition-all rounded-full outline-none cursor-pointer focus:outline-none hover:bg-gray-100 focus:bg-gray-100"
        @click="onGoBackClick"
      >
        <font-awesome-icon icon="arrow-left" class="text-gray-800" size="xs" />
      </button>

      <button
        v-if="!isAllSelected"
        type="button"
        class="px-3 py-2 font-medium transition-all rounded-md outline-none focus:outline-none hover:bg-gray-100 focus:bg-gray-100"
        @click="onClickSelectAll"
      >
        Tout sélectionner
      </button>

      <button
        v-if="isAllSelected"
        type="button"
        class="px-3 py-2 font-medium transition-all rounded-md outline-none focus:outline-none hover:bg-gray-100 focus:bg-gray-100"
        @click="onClickUnselectAll"
      >
        Tout désélectionner
      </button>
    </div>

    <HeaderSubCategories
      class="flex-1 pointer-events-auto max-h-full overflow-y-auto"
      :categories="categories"
      :filtered-categories="filteredCategories"
      :is-sub-category-selected="isSubCategorySelected"
      @category-click="onCategoryClick"
      @filter-click="onFilterClick"
    />
  </aside>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import HeaderSubCategories from '@/components/HeaderSubCategories.vue'
import { Category } from '@/utils/types'

export default Vue.extend({
  components: {
    HeaderSubCategories,
  },
  props: {
    categories: {
      type: Array as PropType<Category[]>,
      required: true,
    },
    filteredCategories: {
      type: Array as PropType<Category['id'][]>,
      default: [],
    },
    isSubCategorySelected: {
      type: Function,
      required: true,
    },
  },
  computed: {
    allCategoriesId(): Category['id'][] {
      return this.categories.map((category) => category.id)
    },
    isAllSelected(): boolean {
      return !this.categories.find(
        (category) => !this.isSubCategorySelected(category.id)
      )
    },
  },
  methods: {
    onCategoryClick(categoryId: Category['id']) {
      this.$emit('category-click', categoryId)
    },
    onFilterClick(categoryId: Category['id']) {
      this.$emit('filter-click', categoryId)
    },
    onClickSelectAll(): void {
      this.$emit('select-all-categories', this.allCategoriesId)
    },
    onClickUnselectAll(): void {
      this.$emit('unselect-all-categories', this.allCategoriesId)
    },
    onGoBackClick() {
      this.$emit('go-back-click')
    },
  },
})
</script>
