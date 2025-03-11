<script lang="ts">
import type {
  FontAwesomeIconProps,
} from '@fortawesome/vue-fontawesome'
import {
  FontAwesomeIcon,
} from '@fortawesome/vue-fontawesome'
import { mapActions, mapState } from 'pinia'
import type { PropType } from 'vue'

import { defineNuxtComponent } from '#app'
import MenuBlock from '~/components/Home/MenuBlock.vue'
import MenuBlockBottom from '~/components/Home/MenuBlockBottom.vue'
import FilterCompo from '~/components/Menu/Filter.vue'
import ItemList from '~/components/Menu/ItemList.vue'
import Search from '~/components/Search/Search.vue'
import Logo from '~/components/UI/Logo.vue'
import type { ApiMenuCategory, MenuGroup, MenuItem } from '~/lib/apiMenu'
import { menuStore } from '~/stores/menu'

export default defineNuxtComponent({
  components: {
    FontAwesomeIcon,
    Logo,
    MenuBlock,
    MenuBlockBottom,
    ItemList,
    FilterCompo,
    Search,
  },

  props: {
    menuBlock: {
      type: String as PropType<'MenuBlock' | 'MenuBlockBottom'>,
      required: true,
    },
    isOnSearch: {
      type: Boolean,
      default: false,
    },
    isFilterActive: {
      type: Boolean,
      default: false,
    },
  },

  data(): {
    navigationParentIdStack: MenuItem['id'][]
    categoryIdFilter: ApiMenuCategory['id'] | null
  } {
    return {
      navigationParentIdStack: [],
      categoryIdFilter: null,
    }
  },

  computed: {
    ...mapState(menuStore, ['filters', 'selectedCategoryIds', 'menuItems']),

    currentParentId(): MenuItem['id'] | undefined {
      return this.navigationParentIdStack.at(-1)
    },

    currentMenuItems(): MenuItem[] {
      return this.getMenuItemByParentId(this.currentParentId)
    },

    isRootMenu(): boolean {
      return this.navigationParentIdStack.length === 0
    },

    size(): FontAwesomeIconProps['size'] {
      return this.isRootMenu ? '2xl' : 'lg'
    },

    isAllSelected(): boolean {
      return this.getRecursiveCategoryIdByParentId(this.currentParentId).every(
        categoryId => this.selectedCategoryIds.includes(categoryId),
      )
    },

    categoriesActivesCountByParent(): Record<ApiMenuCategory['id'], number> {
      const counts: { [id: string]: number } = {}
      this.selectedCategoryIds.forEach((categoryId: ApiMenuCategory['id']) => {
        let parentId = this.menuItems?.[categoryId]?.parent_id
        while (parentId) {
          counts[parentId] = (counts[parentId] || 0) + 1
          parentId = this.menuItems?.[parentId].parent_id
        }
      })
      return counts
    },

    hasSlot(): boolean {
      return this.$slots.default !== undefined
    },
  },

  emits: {
    activateFilter: (_val: boolean) => true,
    scrollTop: () => true,
  },

  watch: {
    currentMenuItems() {
      this.$emit('scrollTop')
    },
  },

  methods: {
    ...mapActions(menuStore, [
      'addSelectedCategoryIds',
      'delSelectedCategoryIds',
    ]),

    getMenuItemByParentId(
      menuGroupId: MenuGroup['id'] | undefined,
    ): MenuItem[] {
      return Object.values(this.menuItems || {})
        .filter(c => (c.parent_id || null) === (menuGroupId || null))
        .sort((a, b) => a.index_order - b.index_order)
    },

    getRecursiveCategoryIdByParentId(
      menuGroupId: MenuGroup['id'] | undefined,
    ): ApiMenuCategory['id'][] {
      const menuItems = this.getMenuItemByParentId(menuGroupId)
      const menuGroups = menuItems.filter(menuItem => menuItem.menu_group)
      const categories = menuItems
        .filter(menuItem => menuItem.category)
        .map(category => category.id)
      return [
        ...categories,
        ...menuGroups
          .map(parent => this.getRecursiveCategoryIdByParentId(parent.id))
          .flat(),
      ].sort()
    },

    onClickSelectAll(): void {
      this.addSelectedCategoryIds(
        this.getRecursiveCategoryIdByParentId(this.currentParentId),
      )
    },

    onClickUnselectAll(): void {
      this.delSelectedCategoryIds(
        this.getRecursiveCategoryIdByParentId(this.currentParentId),
      )
    },

    onGoBackClick() {
      this.navigationParentIdStack.pop()
    },

    onMenuGroupClick(menuGroupId: MenuGroup['id']) {
      this.navigationParentIdStack.push(menuGroupId)
    },

    onCategoryFilterClick(categoryId: ApiMenuCategory['id']) {
      this.categoryIdFilter = categoryId
    },

    onBackToCategoryClick() {
      this.categoryIdFilter = null
    },
  },
})
</script>

<template>
  <component
    :is="menuBlock"
    v-if="categoryIdFilter"
    :is-filter-active="isFilterActive"
  >
    <div class="tw-w-full tw-flex tw-justify-between tw-pb-4">
      <button
        type="button"
        class="tw-flex tw-items-center tw-justify-center tw-w-10 tw-h-10 tw-text-2xl tw-font-bold tw-transition-all tw-rounded-full tw-outline-none tw-cursor-pointer focus:tw-outline-none hover:tw-bg-zinc-100 focus:tw-bg-zinc-100"
        @click="onBackToCategoryClick"
      >
        <FontAwesomeIcon icon="arrow-left" class="tw-text-zinc-800" size="xs" />
      </button>
    </div>

    <FilterCompo
      key="Filter"
      :category-id="categoryIdFilter"
      :filters-values="categoryIdFilter ? filters[categoryIdFilter] : []"
      @activate-filter="$emit('activateFilter', $event)"
      @go-back-click="onBackToCategoryClick"
    />
  </component>

  <div v-else-if="isRootMenu" class="tw-flex tw-flex-col tw-space-y-4">
    <template v-for="(menuItem, index) in currentMenuItems" :key="menuItem.id">
      <component :is="menuBlock" v-if="index === 0 && hasSlot">
        <slot />
      </component>
      <component
        :is="menuBlock"
        v-else-if="index !== 0 && !isOnSearch"
        :class="[index === 0 && 'tw-hidden md:tw-block']"
      >
        <ItemList
          :menu-items="getMenuItemByParentId(menuItem.id)"
          :filters="filters"
          :categories-actives-count-by-parent="categoriesActivesCountByParent"
          :selected-categories-ids="selectedCategoryIds"
          :size="size"
          display-mode-default="compact"
          class="tw-flex-1 tw-pointer-events-auto tw-h-full"
          @menu-group-click="onMenuGroupClick"
          @filter-click="onCategoryFilterClick"
        />
      </component>
    </template>
  </div>

  <div v-else>
    <component :is="menuBlock">
      <div class="tw-w-full tw-flex tw-justify-between tw-pb-4">
        <button
          type="button"
          class="tw-flex tw-items-center tw-justify-center tw-w-10 tw-h-10 tw-text-2xl tw-font-bold tw-transition-all tw-rounded-full tw-outline-none tw-cursor-pointer focus:tw-outline-none hover:tw-bg-zinc-100"
          @click="onGoBackClick"
        >
          <span class="sr-only">{{ $t('headerMenu.back') }}</span>
          <FontAwesomeIcon
            icon="arrow-left"
            class="tw-text-zinc-800"
            size="xs"
          />
        </button>

        <button
          v-if="!isAllSelected"
          type="button"
          class="tw-px-3 tw-py-2 tw-font-medium tw-transition-all tw-rounded-md tw-outline-none focus:tw-outline-none hover:tw-bg-zinc-100 focus:tw-bg-zinc-100"
          @click="onClickSelectAll"
        >
          {{ $t('headerMenu.selectAll') }}
        </button>

        <button
          v-if="isAllSelected"
          type="button"
          class="tw-px-3 tw-py-2 tw-font-medium tw-transition-all tw-rounded-md tw-outline-none focus:tw-outline-none hover:tw-bg-zinc-100 focus:tw-bg-zinc-100"
          @click="onClickUnselectAll"
        >
          {{ $t('headerMenu.unselectAll') }}
        </button>
      </div>

      <ItemList
        :menu-items="currentMenuItems"
        :filters="filters"
        :categories-actives-count-by-parent="categoriesActivesCountByParent"
        :selected-categories-ids="selectedCategoryIds"
        :size="size"
        display-mode-default="large"
        class="tw-flex-1 tw-pointer-events-auto tw-h-full"
        @menu-group-click="onMenuGroupClick"
        @filter-click="onCategoryFilterClick"
      />
    </component>
  </div>
</template>
