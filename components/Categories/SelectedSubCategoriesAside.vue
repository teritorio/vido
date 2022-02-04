<template>
  <aside
    class="px-5 py-4 space-y-6 bg-white shadow-md pointer-events-auto rounded-xl"
  >
    <HeaderSubCategories
      class="flex-1 pointer-events-auto"
      :categories="categories"
      :is-sub-category-selected="isSubCategorySelected"
    />
  </aside>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import HeaderSubCategories from '@/components/Categories/HeaderSubCategories.vue'
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
})
</script>
