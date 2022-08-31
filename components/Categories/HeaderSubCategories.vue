<template>
  <CategoryList
    :menu-items="listItems"
    :filters="filters"
    :categories-activesubs-count="categoriesActivesubsCount"
    @click="onMenuItemClick"
    @filter-click="onFilterClick"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import CategoryList from '~/components/Categories/CategoryList/CategoryList.vue'
import { MenuItem } from '~/lib/apiMenu'
import { FilterValues } from '~/utils/types-filters'

export default Vue.extend({
  components: {
    CategoryList,
  },
  props: {
    menuItems: {
      type: Array,
      required: true,
    },
    filters: {
      type: Object as PropType<{ [subcat: number]: FilterValues }>,
      required: true,
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
      return this.$props.menuItems.map((menuItem: MenuItem) => ({
        ...menuItem,
        colorFill: (menuItem.menu_group || menuItem.link || menuItem.category)
          .color_fill,
        colorLine: (menuItem.menu_group || menuItem.link || menuItem.category)
          .color_line,
        label: (menuItem.menu_group || menuItem.link || menuItem.category).name
          .fr,
        picto: (menuItem.menu_group || menuItem.link || menuItem.category).icon,
        href: menuItem.link?.href,
        filters: menuItem.category?.filters || {},
        selected: this.$props.isSubCategorySelected(menuItem.id),
      }))
    },
  },
  methods: {
    onMenuItemClick(menuItemId: MenuItem['id']) {
      this.$emit('menu-item-click', menuItemId)
    },
    onFilterClick(categoryId: MenuItem['id']) {
      this.$emit('filter-click', categoryId)
    },
  },
})
</script>
