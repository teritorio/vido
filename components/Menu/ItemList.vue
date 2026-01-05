<script setup lang="ts">
import type { FontAwesomeIconProps } from '@fortawesome/vue-fontawesome'
import Category from '~/components/Menu/Category.vue'
import MenuGroup from '~/components/Menu/Group.vue'
import LinkItem from '~/components/Menu/Link.vue'
import type { ApiMenuCategory, ApiMenuItem, MenuGroup as MenuGroupType, MenuItem } from '~/types/api/menu'
import type { FilterValues } from '~/utils/types-filters'

const props = defineProps<{
  menuItems: MenuItem[]
  filters: Record<number, FilterValues>
  categoriesActivesCountByParent: Record<string, number>
  selectedCategoriesIds: ApiMenuCategory['id'][]
  displayModeDefault: 'compact' | 'large'
  size: FontAwesomeIconProps['size']
}>()

const emit = defineEmits<{
  (e: 'menuGroupClick', menuItem: MenuGroupType): void
  (e: 'categoryClick', menuItemId: ApiMenuItem['id']): void
  (e: 'filterClick', categoryId: ApiMenuCategory['id']): void
}>()

function onMenuGroupClick(menuItem: MenuGroupType) {
  emit('menuGroupClick', menuItem)
}

function onCategoryClick(menuItem: MenuItem) {
  emit('categoryClick', menuItem.id)
}

function onFilterClick(categoryId: ApiMenuCategory['id']) {
  emit('filterClick', categoryId)
}

function isCategorySelected(categoryId: ApiMenuCategory['id']) {
  return props.selectedCategoriesIds.includes(categoryId)
}
</script>

<template>
  <div class="tw-grid tw-items-start tw-grid-cols-4 tw-grid-rows-1">
    <template v-for="menuItem in menuItems" :key="menuItem.id">
      <MenuGroup
        v-if="menuItem.menu_group"
        :menu-group="menuItem"
        :categories-actives-count="categoriesActivesCountByParent[menuItem.id]"
        :size="size"
        :display-mode-default="displayModeDefault"
        :class="
          (menuItem.menu_group.display_mode || displayModeDefault)
            === 'large' && ['tw-col-start-1 tw-col-span-4']
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
          (menuItem.category.display_mode || displayModeDefault)
            === 'large' && ['tw-col-start-1 tw-col-span-4']
        "
        @click="onCategoryClick(menuItem)"
        @filter-click="onFilterClick($event)"
      />
    </template>
  </div>
</template>
