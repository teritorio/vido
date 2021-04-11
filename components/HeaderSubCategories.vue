<template>
  <CategoryList :categories="listItems" @click="onCategoryClick" />
</template>

<script lang="ts">
import Vue from 'vue'

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
        picto: category.metadata.picto,
        selected: this.$props.isSubCategorySelected(category.id),
      }))
    },
  },
  methods: {
    onCategoryClick(categoryId: Category['id']) {
      this.$emit('category-click', categoryId)
    },
  },
})
</script>
