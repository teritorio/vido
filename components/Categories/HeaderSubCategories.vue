<template>
  <CategoryList
    :categories="listItems"
    :filtered-categories="filteredCategories"
    :categories-activesubs-count="categoriesActivesubsCount"
    @click="onCategoryClick"
    @filter-click="onFilterClick"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import CategoryList from '@/components/Categories/CategoryList/CategoryList.vue'
import { Category } from '@/utils/types'

export default Vue.extend({
  components: {
    CategoryList,
  },
  props: {
    categories: {
      type: Array,
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
    categoriesActivesubsCount: {
      type: Object as PropType<{ [id: string]: number }>,
      default: () => ({}),
    },
  },
  computed: {
    listItems() {
      return this.$props.categories.map((category: Category) => ({
        ...category,
        color: (category.menu_group || category.category).color,
        label: (category.menu_group || category.category).name.fr,
        picto: (category.menu_group || category.category).icon,
        filters: category.category?.filters || {},
        selected: this.$props.isSubCategorySelected(category.id),
      }))
    },
  },
  methods: {
    onCategoryClick(categoryId: Category['id']) {
      this.$emit('category-click', categoryId)
    },
    onFilterClick(categoryId: Category['id']) {
      this.$emit('filter-click', categoryId)
    },
  },
})
</script>
