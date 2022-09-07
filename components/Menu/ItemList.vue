<template>
  <div class="grid items-start grid-cols-4">
    <template v-for="menuItem in menuItems">
      <MenuGroup
        v-if="menuItem.menu_group"
        :key="menuItem.id"
        :menu-group="menuItem"
        :categories-actives-count="categoriesActivesCountByParent[menuItem.id]"
        :size="size"
        :display-mode-default="displayModeDefault"
        :class="
          (menuItem.menu_group.display_mode || displayModeDefault) ===
            'large' && ['col-start-1 col-span-4']
        "
        @click="onMenuGroupClick(menuItem)"
      />
      <Link
        v-else-if="menuItem.link"
        :key="menuItem.id"
        :menu-link="menuItem"
        :size="size"
        :display-mode-default="displayModeDefault"
        :class="
          (menuItem.link.display_mode || displayModeDefault) === 'large' && [
            'col-start-1 col-span-4',
          ]
        "
      />
      <Category
        v-else-if="menuItem.category"
        :key="menuItem.id"
        :category="menuItem"
        :selected="isCategorySelected(menuItem.id)"
        :filters="filters[menuItem.id]"
        :size="size"
        :display-mode-default="displayModeDefault"
        :class="
          (menuItem.category.display_mode || displayModeDefault) ===
            'large' && ['col-start-1 col-span-4']
        "
        @click="onCategoryClick(menuItem)"
        @filter-click="onFilterClick($event)"
      />
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import Category from '~/components/Menu/Category.vue'
import MenuGroup from '~/components/Menu/Group.vue'
import Link from '~/components/Menu/Link.vue'
import { ApiMenuCategory, MenuItem } from '~/lib/apiMenu'
import { FilterValues } from '~/utils/types-filters'

export default Vue.extend({
  components: {
    Category,
    MenuGroup,
    Link,
  },
  props: {
    menuItems: {
      type: Array as PropType<MenuItem[]>,
      required: true,
    },
    filters: {
      type: Object as PropType<{ [categoryId: number]: FilterValues }>,
      required: true,
    },
    categoriesActivesCountByParent: {
      type: Object as PropType<{ [id: string]: number }>,
      required: true,
    },
    isCategorySelected: {
      type: Function,
      required: true,
    },
    displayModeDefault: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
  },

  methods: {
    onMenuGroupClick(menuItem: MenuItem) {
      this.$emit('menu-group-click', menuItem.id)
    },
    onCategoryClick(menuItem: MenuItem) {
      this.$emit('category-click', menuItem.id)
    },
    onFilterClick(categoryId: ApiMenuCategory['id']) {
      this.$emit('filter-click', categoryId)
    },
  },
})
</script>