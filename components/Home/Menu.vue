<script setup lang="ts">
import type { FontAwesomeIconProps } from '@fortawesome/vue-fontawesome'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { storeToRefs } from 'pinia'
import BreadcrumbsWrapper from '~/components/BreadcrumbsWrapper.vue'
import FilterCompo from '~/components/Menu/Filter.vue'
import ItemList from '~/components/Menu/ItemList.vue'
import type { ApiMenuCategory, MenuGroup, MenuItem } from '~/types/api/menu'
import { menuStore as useMenuStore } from '~/stores/menu'
import MenuBlock from '~/components/Home/MenuBlock.vue'
import MenuBlockBottom from '~/components/Home/MenuBlockBottom.vue'
import { useNavigationStore } from '~/stores/navigation'

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

const device = useDevice()
const slots = useSlots()
const menuStore = useMenuStore()
const navigationStore = useNavigationStore()
const { currentParent, isRootMenu, categoryIdFilter } = storeToRefs(navigationStore)
const { filters, selectedCategoryIds, menuItems } = storeToRefs(menuStore)

const dynamicComponent = computed(() => componentMap[props.menuBlock])

const currentMenuItems = computed((): MenuItem[] => {
  return getMenuItemByParentId(currentParent.value?.id)
})

const size = computed((): FontAwesomeIconProps['size'] => {
  return isRootMenu.value ? '2xl' : 'lg'
})

const isAllSelected = computed((): boolean => {
  return getRecursiveCategoryIdByParentId(currentParent.value?.id).every(
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
  if (!currentParent.value)
    return

  menuStore.addSelectedCategoryIds(
    getRecursiveCategoryIdByParentId(currentParent.value.id),
  )
}

function onClickUnselectAll(): void {
  if (!currentParent.value)
    return

  menuStore.delSelectedCategoryIds(
    getRecursiveCategoryIdByParentId(currentParent.value.id),
  )
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
        @click="navigationStore.setCategoryFilter(null)"
      >
        <FontAwesomeIcon icon="arrow-left" class="tw-text-zinc-800" size="xs" />
      </button>
    </div>

    <FilterCompo
      key="Filter"
      :category-id="categoryIdFilter"
      :filters-values="categoryIdFilter ? filters[categoryIdFilter] : []"
      @activate-filter="$emit('activateFilter', $event)"
      @go-back-click="navigationStore.setCategoryFilter(null)"
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
          @menu-group-click="navigationStore.navigateTo($event)"
          @category-click="menuStore.toggleSelectedCategoryId($event)"
          @filter-click="navigationStore.setCategoryFilter($event)"
        />
      </component>
    </template>
  </div>

  <div v-else>
    <component :is="dynamicComponent">
      <div class="tw-flex tw-items-center tw-justify-between">
        <BreadcrumbsWrapper
          :style="{
            flex: '1 1 auto',
            minWidth: 0,
          }"
        />

        <VBtn
          v-if="!isAllSelected"
          variant="text"
          density="comfortable"
          :title="$t('headerMenu.selectAll')"
          @click="onClickSelectAll"
        >
          <FontAwesomeIcon
            v-if="device.smallScreen"
            class="tw-text-zinc-300"
            :icon="['far', 'circle']"
            size="xl"
          />
          <span v-else>
            {{ $t('headerMenu.selectAll') }}
          </span>
        </VBtn>

        <VBtn
          v-if="isAllSelected"
          variant="text"
          density="comfortable"
          :title="$t('headerMenu.unselectAll')"
          @click="onClickUnselectAll"
        >
          <FontAwesomeIcon
            v-if="device.smallScreen"
            class="tw-text-emerald-500"
            icon="check-circle"
            size="xl"
          />
          <span v-else>
            {{ $t('headerMenu.unselectAll') }}
          </span>
        </VBtn>
      </div>

      <VDivider
        class="border-opacity-100"
        role="presentation"
        aria-orientation="horizontal"
      />

      <ItemList
        :menu-items="currentMenuItems"
        :filters="filters"
        :categories-actives-count-by-parent="categoriesActivesCountByParent"
        :selected-categories-ids="selectedCategoryIds"
        :size="size"
        display-mode-default="large"
        class="tw-flex-1 tw-pointer-events-auto tw-h-full"
        @menu-group-click="navigationStore.navigateTo($event)"
        @category-click="menuStore.toggleSelectedCategoryId($event)"
        @filter-click="navigationStore.setCategoryFilter"
      />
    </component>
  </div>
</template>

<style lang="css" scoped>
.v-btn {
  font-weight: 500;
  font-size: 1rem;
  text-transform: none;
  letter-spacing: inherit;
}
</style>
