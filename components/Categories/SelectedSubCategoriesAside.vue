<template>
  <aside
    class="px-5 py-4 space-y-6 bg-white shadow-md pointer-events-auto rounded-xl"
  >
    <HeaderSubCategories
      class="flex-1 pointer-events-auto"
      :menu-items="menuItems"
      :is-sub-category-selected="isSubCategorySelected"
    />
  </aside>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import HeaderSubCategories from '~/components/Categories/HeaderSubCategories.vue'
import { MenuItem } from '~/lib/apiMenu'

export default Vue.extend({
  components: {
    HeaderSubCategories,
  },
  props: {
    menuItems: {
      type: Array as PropType<MenuItem[]>,
      required: true,
    },
    isSubCategorySelected: {
      type: Function,
      required: true,
    },
  },
  computed: {
    allMenuItemId(): MenuItem['id'][] {
      return this.menuItems.map((menuItem) => menuItem.id)
    },
    isAllSelected(): boolean {
      return !this.menuItems.find(
        (menuItem) => !this.isSubCategorySelected(menuItem.id)
      )
    },
  },
})
</script>
