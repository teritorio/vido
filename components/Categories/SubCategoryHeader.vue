<template>
  <aside
    class="relative flex flex-col px-5 py-4 space-y-6 overflow-y-auto bg-white shadow-md pointer-events-auto inset-auto max-h-screen-3/5 h-max sm:max-h-full sm:rounded-xl"
  >
    <div class="flex justify-between">
      <button
        type="button"
        class="flex items-center justify-center w-10 h-10 text-2xl font-bold transition-all rounded-full outline-none cursor-pointer focus:outline-none hover:bg-zinc-100 focus:bg-zinc-100"
        @click="onGoBackClick"
      >
        <font-awesome-icon icon="arrow-left" class="text-zinc-800" size="xs" />
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

    <HeaderSubCategories
      class="flex-1 h-full overflow-y-auto pointer-events-auto"
      :menu-items="menuItems"
      :filters="filters"
      :is-sub-category-selected="isSubCategorySelected"
      :categories-activesubs-count="categoriesActivesubsCount"
      @menu-item-click="onMenuItemClick"
      @filter-click="onFilterClick"
    />
  </aside>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import HeaderSubCategories from '~/components/Categories/HeaderSubCategories.vue'
import { MenuItem } from '~/lib/apiMenu'
import { FilterValues } from '~/utils/types-filters'

export default Vue.extend({
  components: {
    HeaderSubCategories,
  },
  props: {
    menuItems: {
      type: Array as PropType<MenuItem[]>,
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
    allMenuItemIds(): MenuItem['id'][] {
      let ids: MenuItem['id'][] = []
      this.menuItems.forEach((c: MenuItem) => {
        if (
          c?.menu_group?.vido_children &&
          c.menu_group.vido_children.length > 0
        ) {
          ids = ids.concat(c.menu_group.vido_children)
        } else {
          ids.push(c.id)
        }
      })
      return ids
    },
    isAllSelected(): boolean {
      let hasNotSelected = false

      for (const c of this.menuItems) {
        if (
          c?.menu_group?.vido_children &&
          c.menu_group.vido_children.length > 0
        ) {
          for (const sc of c.menu_group.vido_children) {
            if (!this.isSubCategorySelected(sc)) {
              hasNotSelected = true
              break
            }
          }
        } else if (!this.isSubCategorySelected(c.id)) {
          hasNotSelected = true
          break
        }
      }

      return !hasNotSelected
    },
  },
  methods: {
    onMenuItemClick(menuItemId: MenuItem['id']) {
      this.$emit('menu-item-click', menuItemId)
    },
    onFilterClick(menuItemId: MenuItem['id']) {
      this.$emit('filter-click', menuItemId)
    },
    onClickSelectAll(): void {
      this.$emit('select-all-categories', this.allMenuItemIds)
    },
    onClickUnselectAll(): void {
      this.$emit('unselect-all-categories', this.allMenuItemIds)
    },
    onGoBackClick() {
      this.$emit('go-back-click')
    },
  },
})
</script>
