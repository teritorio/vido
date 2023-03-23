<template>
  <div class="tw-grid tw-items-start tw-grid-cols-4">
    <template v-for="menuItem in menuItems" :key="menuItem.id">
      <MenuGroup
        v-if="menuItem.menu_group"
        :menu-group="menuItem"
        :categories-actives-count="categoriesActivesCountByParent[menuItem.id]"
        :size="size"
        :display-mode-default="displayModeDefault"
        :class="
          (menuItem.menu_group.display_mode || displayModeDefault) ===
            'large' && ['tw-col-start-1 tw-col-span-4']
        "
        @click="onMenuGroupClick(menuItem)"
      />
      <LinkItem
        v-else-if="menuItem.link"
        :menu-link="menuItem"
        :size="size"
        :display-mode-default="displayModeDefault"
        :class="
          (menuItem.link.display_mode || displayModeDefault) === 'large' && [
            'tw-col-start-1 tw-col-span-4',
          ]
        "
      />
      <Category
        v-else-if="menuItem.category"
        :category="menuItem"
        :selected="isCategorySelected(menuItem.id)"
        :filters="filters[menuItem.id]"
        :size="size"
        :display-mode-default="displayModeDefault"
        :class="
          (menuItem.category.display_mode || displayModeDefault) ===
            'large' && ['tw-col-start-1 tw-col-span-4']
        "
        @click="onCategoryClick(menuItem)"
        @filter-click="onFilterClick($event)"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { FontAwesomeIconProps } from '@fortawesome/vue-fontawesome'
import { PropType } from 'vue'

import { defineNuxtComponent } from '#app'
import Category from '~/components/Menu/Category.vue'
import MenuGroup from '~/components/Menu/Group.vue'
import LinkItem from '~/components/Menu/Link.vue'
import { ApiMenuCategory, ApiMenuItem, MenuItem } from '~/lib/apiMenu'
import { FilterValues } from '~/utils/types-filters'

export default defineNuxtComponent({
  components: {
    Category,
    MenuGroup,
    LinkItem,
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
    selectedCategoriesIds: {
      type: Array as PropType<ApiMenuCategory['id'][]>,
      required: true,
    },
    displayModeDefault: {
      type: String as PropType<'compact' | 'large'>,
      required: true,
    },
    size: {
      type: String as PropType<FontAwesomeIconProps['size']>,
      required: true,
    },
  },

  emits: {
    'menu-group-click': (menuItemId: ApiMenuItem['id']) => true,
    'category-click': (menuItemId: ApiMenuItem['id']) => true,
    'filter-click': (categoryId: ApiMenuCategory['id']) => true,
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
    isCategorySelected(categoryId: ApiMenuCategory['id']) {
      return this.selectedCategoriesIds.includes(categoryId)
    },
  },
})
</script>
