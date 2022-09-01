<template>
  <div>
    <div class="flex justify-between">
      <button
        v-if="!isRootMenu"
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

    <ItemList
      :menu-items="currentMenuItems"
      :filters="filters"
      :categories-actives-count-by-parent="categoriesActivesCountByParent"
      :is-category-selected="isCategorySelected"
      :size="size"
      class="flex-1 pointer-events-auto px-5 py-4 h-full"
      @menu-group-click="onMenuGroupClick"
      @category-click="onCategoryClick"
      @filter-click="onSubCategoryFilterClick"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters, mapActions } from 'vuex'

import ItemList from '~/components/Menu/ItemList.vue'
import { getMenuByParentId, MenuGroup, MenuItem } from '~/lib/apiMenu'
import { FilterValues } from '~/utils/types-filters'

export default Vue.extend({
  components: {
    ItemList,
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
    isCategorySelected: {
      type: Function,
      required: true,
    },
    categoriesActivesCountByParent: {
      type: Object as PropType<{ [id: string]: number }>,
      required: true,
    },
  },

  data(): {
    navigationParentIdStack: MenuItem['id'][]
  } {
    return {
      navigationParentIdStack: [],
    }
  },

  computed: {
    ...mapGetters({}),
    currentParentId(): MenuItem['id'] | undefined {
      return this.navigationParentIdStack.at(-1)
    },

    isRootMenu(): boolean {
      return this.currentParentId === undefined
    },

    currentMenuItems(): MenuItem[] {
      return getMenuByParentId(this.menuItems, this.currentParentId)
    },

    size(): string {
      return this.isRootMenu ? '2xl' : 'lg'
    },

    isAllSelected(): boolean {
      let hasNotSelected = false

      for (const c of this.menuItems) {
        if (
          c.menu_group?.vido_children &&
          c.menu_group.vido_children.length > 0
        ) {
          for (const sc of c.menu_group.vido_children) {
            if (!this.isCategorySelected(sc)) {
              hasNotSelected = true
              break
            }
          }
        } else if (!this.isCategorySelected(c.id)) {
          hasNotSelected = true
          break
        }
      }

      return !hasNotSelected
    },
  },
  watch: {},

  created() {},

  beforeMount() {},

  methods: {
    ...mapActions({}),

    onClickSelectAll(): void {
      // this.$emit('select-all-categories', this.allMenuItemIds)////////////////  TODO
    },

    onClickUnselectAll(): void {
      // this.$emit('unselect-all-categories', this.allMenuItemIds) ///////////// TODO
    },

    onGoBackClick() {
      this.navigationParentIdStack.pop()
    },

    onMenuGroupClick(menuGroupId: MenuGroup['id']) {
      this.navigationParentIdStack.push(menuGroupId)
    },
  },
})
</script>
