<template>
  <div
    v-if="selectedCategories && selectedCategories.length > 0"
    class="flex flex-row p-2 flex-wrap bg-white shadow-md pointer-events-auto rounded-xl max-w-xl"
    style="min-width: 64px"
  >
    <div
      v-for="menuItem in selectedCategories"
      :id="`selected-category-${menuItem.id}`"
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
        :title="$t('headerMenu.hideCategory')"
        @click="delSelectedCategoryIds([menuItem.id])"
      >
        <span class="sr-only">{{ $t('headerMenu.disableCategory') }}</span>
        <font-awesome-icon icon="times" class="text-white" size="sm" />
      </button>
    </div>
    <button
      v-if="selectedCategories.length > 1"
      type="button"
      class="flex items-center justify-center text-white text-center rounded-full absolute -right-0 top-1 w-7 h-7 border-2 border-white bg-red-600 hover:bg-red-800"
      :title="$t('headerMenu.clearAllCategories')"
      :aria-label="$t('headerMenu.clearAllCategories')"
      @click="clearSelectedCategoryIds()"
    >
      <font-awesome-icon icon="times" class="text-white" />
    </button>
  </div>
</template>

<script lang="ts">
import { mapState, mapActions } from 'pinia'

import { defineNuxtComponent } from '#app'
import TeritorioIconBadge from '~/components/UI/TeritorioIconBadge.vue'
import { menuStore } from '~/stores/menu'

export default defineNuxtComponent({
  components: {
    TeritorioIconBadge,
  },

  computed: {
    ...mapState(menuStore, ['selectedCategories']),
  },

  methods: {
    ...mapActions(menuStore, [
      'delSelectedCategoryIds',
      'clearSelectedCategoryIds',
    ]),
  },
})
</script>
