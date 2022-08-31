<template>
  <ul v-if="menuItems.length > 0">
    <CategoryListItem
      v-for="menuItem in menuItems"
      :key="menuItem.id"
      :href="menuItem.href"
      :menu-item="menuItem"
      :selected="menuItem.selected"
      :filters="filters[menuItem.id]"
      :active-sub-categories="categoriesActivesubsCount[menuItem.id] || 0"
      @click="onCategoryClick"
      @filter-click="onFilterClick"
    />
  </ul>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import CategoryListItem from '~/components/Categories/CategoryList/CategoryListItem.vue'
import { ApiMenuCategory, MenuItem } from '~/lib/apiMenu'
import { FilterValues } from '~/utils/types-filters'

export default Vue.extend({
  components: {
    CategoryListItem,
  },
  props: {
    menuItems: {
      type: Array as PropType<MenuItem[]>,
      default: () => [],
    },
    filters: {
      type: Object as PropType<{ [subcat: number]: FilterValues }>,
      required: true,
    },
    categoriesActivesubsCount: {
      type: Object as PropType<{ [id: string]: number }>,
      default: () => ({}),
    },
  },
  methods: {
    onCategoryClick(menuItemId: MenuItem['id']) {
      this.$emit('click', menuItemId)
    },
    onFilterClick(categoryId: ApiMenuCategory['id']) {
      this.$emit('filter-click', categoryId)
    },
  },
})
</script>
