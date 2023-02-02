<template>
  <component
    :is="menuBlock"
    v-if="categoryIdFilter"
    :is-filter-active="isFilterActive"
  >
    <div class="w-full flex justify-between pb-4">
      <button
        type="button"
        class="flex items-center justify-center w-10 h-10 text-2xl font-bold transition-all rounded-full outline-none cursor-pointer focus:outline-none hover:bg-zinc-100 focus:bg-zinc-100"
        @click="onBackToCategoryClick"
      >
        <font-awesome-icon icon="arrow-left" class="text-zinc-800" size="xs" />
      </button>
    </div>

    <FilterCompo
      key="Filter"
      :category-id="categoryIdFilter"
      :filters-values="categoryIdFilter ? filters[categoryIdFilter] : []"
      @activate-filter="$emit('activate-filter', $event)"
      @go-back-click="onBackToCategoryClick"
    />
  </component>

  <div v-else-if="isRootMenu">
    <template v-for="(menuItem, index) in currentMenuItems">
      <component :is="menuBlock" v-if="index === 0" :key="menuItem.id">
        <slot />
      </component>
      <component
        :is="menuBlock"
        v-else-if="!isOnSearch"
        :key="menuItem.id"
        :class="[index === 0 && 'hidden md:block']"
      >
        <ItemList
          :menu-items="getMenuItemByParentId(menuItem.id)"
          :filters="filters"
          :categories-actives-count-by-parent="categoriesActivesCountByParent"
          :selected-categories-ids="selectedCategoryIds"
          :size="size"
          display-mode-default="compact"
          class="flex-1 pointer-events-auto h-full"
          @menu-group-click="onMenuGroupClick"
          @category-click="toggleSelectedCategoryId($event)"
          @filter-click="onCategoryFilterClick"
        />
      </component>
    </template>
  </div>

  <div v-else>
    <component :is="menuBlock">
      <div class="w-full flex justify-between pb-4">
        <button
          type="button"
          class="flex items-center justify-center w-10 h-10 text-2xl font-bold transition-all rounded-full outline-none cursor-pointer focus:outline-none hover:bg-zinc-100 focus:bg-zinc-100"
          @click="onGoBackClick"
        >
          <span class="sr-only">{{ $tc('headerMenu.back') }}</span>
          <font-awesome-icon
            icon="arrow-left"
            class="text-zinc-800"
            size="xs"
          />
        </button>

        <button
          v-if="!isAllSelected"
          type="button"
          class="px-3 py-2 font-medium transition-all rounded-md outline-none focus:outline-none hover:bg-zinc-100 focus:bg-zinc-100"
          @click="onClickSelectAll"
        >
          {{ $tc('headerMenu.selectAll') }}
        </button>

        <button
          v-if="isAllSelected"
          type="button"
          class="px-3 py-2 font-medium transition-all rounded-md outline-none focus:outline-none hover:bg-zinc-100 focus:bg-zinc-100"
          @click="onClickUnselectAll"
        >
          {{ $tc('headerMenu.unselectAll') }}
        </button>
      </div>

      <ItemList
        :menu-items="currentMenuItems"
        :filters="filters"
        :categories-actives-count-by-parent="categoriesActivesCountByParent"
        :selected-categories-ids="selectedCategoryIds"
        :size="size"
        display-mode-default="large"
        class="flex-1 pointer-events-auto h-full"
        @menu-group-click="onMenuGroupClick"
        @category-click="toggleSelectedCategoryId($event)"
        @filter-click="onCategoryFilterClick"
      />
    </component>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters, mapActions } from 'vuex'

import MenuBlock from '~/components/Home/MenuBlock.vue'
import MenuBlockBottom from '~/components/Home/MenuBlockBottom.vue'
import FilterCompo from '~/components/Menu/Filter.vue'
import ItemList from '~/components/Menu/ItemList.vue'
import Search from '~/components/Search/Search.vue'
import Logo from '~/components/UI/Logo.vue'
import { ApiMenuCategory, MenuGroup, MenuItem } from '~/lib/apiMenu'
import { FilterValues } from '~/utils/types-filters'

export default Vue.extend({
  components: {
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
    ...mapGetters({
      filters: 'menu/filters',
      selectedCategoryIds: 'menu/selectedCategoryIds',
    }),

    menuItems(): Record<ApiMenuCategory['id'], MenuItem> {
      return this.$store.getters['menu/menuItems']
    },

    currentParentId(): MenuItem['id'] | undefined {
      return this.navigationParentIdStack.at(-1)
    },

    currentMenuItems(): MenuItem[] {
      return this.getMenuItemByParentId(this.currentParentId)
    },

    isRootMenu(): boolean {
      return this.navigationParentIdStack.length === 0
    },

    size(): string {
      return this.isRootMenu ? '2xl' : 'lg'
    },

    isAllSelected(): boolean {
      return this.getRecursiveCategoryIdByParentId(this.currentParentId).every(
        (categoryId) => this.selectedCategoryIds.includes(categoryId)
      )
    },

    categoriesActivesCountByParent(): Record<ApiMenuCategory['id'], number> {
      const counts: { [id: string]: number } = {}
      this.selectedCategoryIds.forEach((categoryId: ApiMenuCategory['id']) => {
        let parentId = this.menuItems[categoryId]?.parent_id
        while (parentId) {
          counts[parentId] = (counts[parentId] || 0) + 1
          parentId = this.menuItems[parentId].parent_id
        }
      })
      return counts
    },
  },

  watch: {
    currentMenuItems() {
      this.$emit('scroll-top')
    },
  },

  methods: {
    ...mapActions({
      addSelectedCategoryIds: 'menu/addSelectedCategoryIds',
      delSelectedCategoryIds: 'menu/delSelectedCategoryIds',
      toggleSelectedCategoryId: 'menu/toggleSelectedCategoryId',
    }),

    getMenuItemByParentId(
      menuGroupId: MenuGroup['id'] | undefined
    ): MenuItem[] {
      return Object.values(this.menuItems)
        .filter((c) => c.parent_id === (menuGroupId || null))
        .sort((a, b) => a.index_order - b.index_order)
    },

    getRecursiveCategoryIdByParentId(
      menuGroupId: MenuGroup['id'] | undefined
    ): ApiMenuCategory['id'][] {
      const menuItems = this.getMenuItemByParentId(menuGroupId)
      const menuGroups = menuItems.filter((menuItem) => menuItem.menu_group)
      const categories = menuItems
        .filter((menuItem) => menuItem.category)
        .map((category) => category.id)
      return [
        ...categories,
        ...menuGroups
          .map((parent) => this.getRecursiveCategoryIdByParentId(parent.id))
          .flat(),
      ].sort()
    },

    onClickSelectAll(): void {
      this.addSelectedCategoryIds(
        this.getRecursiveCategoryIdByParentId(this.currentParentId)
      )
    },

    onClickUnselectAll(): void {
      this.delSelectedCategoryIds(
        this.getRecursiveCategoryIdByParentId(this.currentParentId)
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
