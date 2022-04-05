<template>
  <ul v-if="categories.length > 0">
    <CategoryListItem
      v-for="category in categories"
      :key="category.id"
      :href="category.href"
      :category="category"
      :selected="category.selected"
      :filtered="filteredCategories.includes(category.id)"
      :active-sub-categories="categoriesActivesubsCount[category.id] || 0"
      @click="onCategoryClick"
      @filter-click="onFilterClick"
    />
  </ul>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import CategoryListItem from '@/components/Categories/CategoryList/CategoryListItem.vue'
import { Category } from '@/lib/apiMenu'

export default Vue.extend({
  components: {
    CategoryListItem,
  },
  props: {
    categories: {
      type: Array,
      default() {
        return []
      },
    },
    filteredCategories: {
      type: Array as PropType<Category['id'][]>,
      default: [],
    },
    categoriesActivesubsCount: {
      type: Object as PropType<{ [id: string]: number }>,
      default: () => ({}),
    },
  },
  methods: {
    onCategoryClick(categoryId: Category['id']) {
      this.$emit('click', categoryId)
    },
    onFilterClick(categoryId: Category['id']) {
      this.$emit('filter-click', categoryId)
    },
  },
})
</script>
