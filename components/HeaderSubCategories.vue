<template>
  <CategoryList
    :categories="listItems"
    :filtered-categories="filteredCategories"
    @click="onCategoryClick"
    @filter-click="onFilterClick"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import CategoryList from '@/components/CategoryList/CategoryList.vue'
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
  },
  computed: {
    listItems() {
      return this.$props.categories.map((category: Category) => ({
        id: category.id,
        color: category.metadata.color,
        label: category.metadata.label.fr,
        level: category.level,
        picto: category.metadata.picto,
        filtres: category.datasources
          .filter((ds) => ds.HasFiltre)
          .map((ds) => ({ idsrc: ds.idsrc, filtre: ds.filtre })),
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
