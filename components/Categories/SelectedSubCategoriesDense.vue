<template>
  <div
    v-if="selectedMenuItems.length > 0"
    class="flex flex-row p-2 flex-wrap bg-white shadow-md pointer-events-auto rounded-xl max-w-xl"
    style="min-width: 64px"
  >
    <div
      v-for="menuItem in selectedMenuItems"
      :key="menuItem.id"
      class="m-1 relative"
      :title="
        (menuItem.menu_group || menuItem.link || menuItem.category).name.fr
      "
    >
      <TeritorioIconBadge
        :id="menuItem.id"
        :color-fill="
          (menuItem.menu_group || menuItem.link || menuItem.category).color_fill
        "
        :picto="
          (menuItem.menu_group || menuItem.link || menuItem.category).icon
        "
        size="lg"
      />
      <button
        class="flex items-center justify-center text-white text-center rounded-full absolute -top-1 -right-1 w-5 h-5 border-2 border-white bg-red-600"
        :title="$tc('headerMenu.hideCategory')"
        @click="() => unselectCategory(menuItem.id)"
      >
        <font-awesome-icon icon="times" class="text-white" size="sm" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import TeritorioIconBadge from '~/components/UI/TeritorioIconBadge.vue'
import { ApiMenuCategory, MenuItem } from '~/lib/apiMenu'

export default Vue.extend({
  components: {
    TeritorioIconBadge,
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
    selectedMenuItems() {
      return this.menuItems.filter((c) => this.isSubCategorySelected(c.id))
    },
  },
  methods: {
    unselectCategory(categoryId: ApiMenuCategory['id']) {
      this.$emit('category-unselect', [categoryId])
    },
  },
})
</script>
