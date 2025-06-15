<script setup lang="ts">
import type { FontAwesomeIconProps } from '@fortawesome/vue-fontawesome'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { storeToRefs } from 'pinia'
import FilterCompo from '~/components/Menu/Filter.vue'
import ItemList from '~/components/Menu/ItemList.vue'
import type { ApiMenuCategory, MenuGroup, MenuItem } from '~/lib/apiMenu'
import { menuStore as useMenuStore } from '~/stores/menu'
import MenuBlock from '~/components/Home/MenuBlock.vue'
import MenuBlockBottom from '~/components/Home/MenuBlockBottom.vue'

const props = withDefaults(defineProps<{
  menuBlock: keyof typeof componentMap
  isOnSearch?: boolean
  isFilterActive?: boolean
}>(), {
  isOnSearch: false,
  isFilterActive: false,
})

const emit = defineEmits<{
  (e: 'activateFilter', val: boolean): void
  (e: 'scrollTop'): void
}>()

const componentMap = {
  MenuBlock,
  MenuBlockBottom,
} as const

const slots = useSlots()
const menuStore = useMenuStore()
const { filters, selectedCategoryIds, menuItems } = storeToRefs(menuStore)
const navigationParentIdStack = ref<MenuItem['id'][]>([])
const categoryIdFilter = ref<ApiMenuCategory['id'] | null>(null)

const dynamicComponent = computed(() => componentMap[props.menuBlock])

const currentParentId = computed((): MenuItem['id'] | undefined => {
  return navigationParentIdStack.value.at(-1)
})

const currentMenuItems = computed((): MenuItem[] => {
  return getMenuItemByParentId(currentParentId.value)
})

const isRootMenu = computed((): boolean => {
  return navigationParentIdStack.value.length === 0
})

const size = computed((): FontAwesomeIconProps['size'] => {
  return isRootMenu.value ? '2xl' : 'lg'
})

const isAllSelected = computed((): boolean => {
  return getRecursiveCategoryIdByParentId(currentParentId.value).every(
    categoryId => selectedCategoryIds.value.includes(categoryId),
  )
})

const categoriesActivesCountByParent = computed((): Record<ApiMenuCategory['id'], number> => {
  const counts: { [id: string]: number } = {}

  selectedCategoryIds.value.forEach((categoryId: ApiMenuCategory['id']) => {
    let parentId = menuItems?.value?.[categoryId]?.parent_id
    while (parentId) {
      counts[parentId] = (counts[parentId] || 0) + 1
      parentId = menuItems?.value?.[parentId].parent_id
    }
  })
  return counts
})

const hasSlot = computed((): boolean => {
  return slots.default !== undefined
})

watch(currentMenuItems, () => {
  emit('scrollTop')
})

function getMenuItemByParentId(menuGroupId: MenuGroup['id'] | undefined): MenuItem[] {
  return Object.values(menuItems?.value || {})
    .filter(c => (c.parent_id || null) === (menuGroupId || null))
    .sort((a, b) => a.index_order - b.index_order)
}

function getRecursiveCategoryIdByParentId(menuGroupId: MenuGroup['id'] | undefined): ApiMenuCategory['id'][] {
  const menuItems = getMenuItemByParentId(menuGroupId)
  const menuGroups = menuItems.filter(menuItem => menuItem.menu_group)
  const categories = menuItems
    .filter(menuItem => menuItem.category)
    .map(category => category.id)
  return [
    ...categories,
    ...menuGroups
      .map(parent => getRecursiveCategoryIdByParentId(parent.id))
      .flat(),
  ].sort()
}

function onClickSelectAll(): void {
  menuStore.addSelectedCategoryIds(
    getRecursiveCategoryIdByParentId(currentParentId.value),
  )
}

function onClickUnselectAll(): void {
  menuStore.delSelectedCategoryIds(
    getRecursiveCategoryIdByParentId(currentParentId.value),
  )
}

function onGoBackClick() {
  navigationParentIdStack.value.pop()
}

function onMenuGroupClick(menuGroupId: MenuGroup['id']) {
  navigationParentIdStack.value.push(menuGroupId)
}

function onCategoryFilterClick(categoryId: ApiMenuCategory['id']) {
  categoryIdFilter.value = categoryId
}

function onBackToCategoryClick() {
  categoryIdFilter.value = null
}
</script>

<template>
  <component
    :is="dynamicComponent"
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
      <component :is="dynamicComponent" v-if="index === 0 && hasSlot">
        <slot />
      </component>
      <component
        :is="dynamicComponent"
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
          @category-click="menuStore.toggleSelectedCategoryId($event)"
          @filter-click="onCategoryFilterClick"
        />
      </component>
    </template>
  </div>

  <div v-else>
    <component :is="dynamicComponent">
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
        @category-click="menuStore.toggleSelectedCategoryId($event)"
        @filter-click="onCategoryFilterClick"
      />
    </component>
  </div>
</template>
