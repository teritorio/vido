<template>
  <div
    v-if="menuItems.length > 0"
    class="flex flex-row p-2 flex-wrap bg-white shadow-md pointer-events-auto rounded-xl max-w-xl"
    style="min-width: 64px"
  >
    <div
      v-for="menuItem in menuItems"
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
        type="button"
        class="flex items-center justify-center text-white text-center rounded-full absolute -top-1 -right-1 w-5 h-5 border-2 border-white bg-red-600 hover:bg-red-800"
        :title="$tc('headerMenu.hideCategory')"
        @click="() => unselectCategory(menuItem.id)"
      >
        <span class="sr-only">{{ $tc('headerMenu.disableCategory') }}</span>
        <font-awesome-icon icon="times" class="text-white" size="sm" />
      </button>
    </div>
    <button
      v-if="menuItems.length > 1"
      type="button"
      class="flex items-center justify-center text-white text-center rounded-full absolute -right-0 top-1 w-7 h-7 border-2 border-white bg-red-600 hover:bg-red-800"
      :title="$tc('headerMenu.clearAllCategories')"
      :aria-label="$tc('headerMenu.clearAllCategories')"
      @click="() => clearAllCategories()"
    >
      <font-awesome-icon icon="times" class="text-white" size="md" />
    </button>
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
  },

  methods: {
    unselectCategory(categoryId: ApiMenuCategory['id']) {
      this.$emit('category-unselect', [categoryId])
    },
    clearAllCategories() {
      this.$emit('category-clear')
    },
  },
})
</script>
