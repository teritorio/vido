<template>
  <ul v-if="categories.length > 0">
    <CategoryListItem
      v-for="category in categories"
      :id="category.id"
      :key="category.id"
      :color="category.color"
      :label="category.label"
      :selected="category.selected"
      :picto="category.picto"
      @click="onCategoryClick"
    />
  </ul>
</template>

<script lang="ts">
import Vue from 'vue'

import CategoryListItem from '@/components/CategoryList/CategoryListItem.vue'
import { Category } from '@/utils/types'

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
  },
  methods: {
    onCategoryClick(categoryId: Category['id']) {
      this.$emit('click', categoryId)
    },
  },
})
</script>
