<template>
  <aside
    class="hidden sm:block absolute bottom-0 px-5 py-4 overflow-y-auto bg-white shadow-md pointer-events-auto relative inset-auto h-auto space-y-10 rounded-xl"
  >
    <div class="items-center justify-between hidden sm:flex">
      <h1>
        <a
          :href="mainUrl"
          rel="noopener noreferrer"
          :aria-label="siteName"
          :title="siteName"
          target="_blank"
        >
          <img
            :aria-label="siteName"
            :src="logoUrl"
            class="w-auto h-auto max-w-2xl max-h-16"
          />
        </a>
      </h1>

      <button
        type="button"
        class="flex items-center justify-center w-10 h-10 text-2xl font-bold transition-all rounded-full outline-none cursor-pointer focus:outline-none hover:bg-gray-100 focus:bg-gray-100"
        @click="onSearchClick"
      >
        <font-awesome-icon icon="search" class="text-gray-800" size="xs" />
      </button>
    </div>

    <HeaderRootCategories
      v-if="showCategories"
      class="flex-1 pointer-events-auto max-h-screen-1/2 2xl:max-h-screen overflow-y-auto"
      :highlighted-categories="highlightedCategories"
      :non-highlighted-categories="nonHighlightedCategories"
      :categories-activesubs-count="categoriesActivesubsCount"
      @category-click="onCategoryClick"
    />
  </aside>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import HeaderRootCategories from '@/components/HeaderRootCategories.vue'
import { Category } from '@/utils/types'

export default Vue.extend({
  components: {
    HeaderRootCategories,
  },
  props: {
    highlightedCategories: {
      type: Array,
      required: true,
    },
    logoUrl: {
      type: String,
      required: true,
    },
    mainUrl: {
      type: String,
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
    showCategories: {
      type: Boolean,
      default: true,
    },
    categoriesActivesubsCount: {
      type: Object as PropType<{ [id: string]: number }>,
      default: {},
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
