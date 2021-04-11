<template>
  <aside
    class="px-5 py-4 space-y-10 bg-white shadow-md pointer-events-auto rounded-xl"
  >
    <div class="flex items-center justify-between">
      <h1>
        <Logo :aria-label="siteName" class="h-auto w-36" />
      </h1>

      <!-- <button
          type="button"
          class="flex items-center justify-center w-10 h-10 text-2xl font-bold transition-all rounded-full outline-none cursor-pointer focus:outline-none hover:bg-gray-100 focus:bg-gray-100"
        >
          <font-awesome-icon icon="minus" class="text-gray-800" size="xs" />
        </button> -->

      <button
        type="button"
        class="flex items-center justify-center w-10 h-10 text-2xl font-bold transition-all rounded-full outline-none cursor-pointer focus:outline-none hover:bg-gray-100 focus:bg-gray-100"
        @click="onSearchClick"
      >
        <font-awesome-icon icon="search" class="text-gray-800" size="xs" />
      </button>
    </div>

    <HeaderSuperCategories
      class="flex-1 pointer-events-auto"
      :highlighted-categories="highlightedCategories"
      :non-highlighted-categories="nonHighlightedCategories"
      @category-click="onCategoryClick"
    />
  </aside>
</template>

<script lang="ts">
import Vue from 'vue'

import HeaderSuperCategories from '@/components/HeaderSuperCategories.vue'
import Logo from '@/components/Logo/Logo.vue'
import { Category } from '@/utils/types'

export default Vue.extend({
  components: {
    HeaderSuperCategories,
    Logo,
  },
  props: {
    highlightedCategories: {
      type: Array,
      required: true,
    },
    nonHighlightedCategories: {
      type: Array,
      required: true,
    },
    siteName: {
      type: String,
      required: true,
    },
  },
  methods: {
    onCategoryClick(categoryId: Category['id']) {
      this.$emit('category-click', categoryId)
    },
    onSearchClick() {
      this.$emit('search-click')
    },
  },
})
</script>
