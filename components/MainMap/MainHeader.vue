<template>
  <aside
    class="hidden sm:block absolute bottom-0 overflow-y-auto pointer-events-auto relative inset-auto h-auto space-y-4 p-2"
  >
    <div
      :class="[
        'items-center justify-between hidden sm:flex rounded-xl shadow-md px-5 py-4',
        isExplorerFavorite ? 'bg-blue-500 text-white' : 'bg-white',
      ]"
    >
      <h1 v-if="!isExplorerFavorite">
        <a
          :href="mainUrl"
          rel="noopener noreferrer"
          :aria-label="siteName"
          :title="siteName"
          target="_blank"
        >
          <img :src="logoUrl" class="w-auto h-auto max-w-2xl max-h-16" />
        </a>
      </h1>

      <button
        v-if="showCategories"
        type="button"
        class="flex items-center justify-center w-10 h-10 text-2xl font-bold transition-all rounded-full outline-none cursor-pointer focus:outline-none hover:bg-gray-100 focus:bg-gray-100"
        @click="onSearchClick"
      >
        <font-awesome-icon icon="search" class="text-gray-800" size="xs" />
      </button>

      <div v-else class="flex items-center ml-2">
        <button
          type="button"
          class="flex flex-shrink-0 items-center justify-center w-10 h-10 text-2xl font-bold transition-all rounded-full outline-none cursor-pointer focus:outline-none hover:bg-blue-700 focus:bg-blue-700"
          @click="goToCategories"
        >
          <font-awesome-icon icon="arrow-left" class="text-white" size="xs" />
        </button>
        <p class="ml-2">
          {{
            $tc(
              isFavorite
                ? 'headerMenu.backToMenuFavorites'
                : 'headerMenu.backToMenuExplorer'
            )
          }}
        </p>
      </div>
    </div>

    <div v-if="showCategories">
      <HeaderRootCategories
        v-for="category in categoryRootCategories"
        :key="category.id"
        :class="[
          'flex-1 pointer-events-auto 2xl:max-h-screen overflow-y-auto bg-white rounded-xl shadow-md px-5 py-4 mb-4',
          showPoi && 'max-h-screen-1/2',
        ]"
        :categories-activesubs-count="categoriesActivesubsCount"
        :category-id="category.id"
        @category-click="onCategoryClick"
      />
    </div>
  </aside>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters } from 'vuex'

import HeaderRootCategories from '@/components/Categories/HeaderRootCategories.vue'
import { Category } from '@/utils/types'

export default Vue.extend({
  components: {
    HeaderRootCategories,
  },
  props: {
    showPoi: {
      type: Boolean,
      default: false,
    },
    logoUrl: {
      type: String,
      required: true,
    },
    mainUrl: {
      type: String,
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
    isExplorerFavorite: {
      type: Boolean,
      default: false,
    },
    categoriesActivesubsCount: {
      type: Object as PropType<{ [id: string]: number }>,
      default: {},
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters({
      categoryRootCategories: 'menu/categoryRootCategories',
    }),
  },
  methods: {
    onCategoryClick(categoryId: Category['id']) {
      this.$emit('category-click', categoryId)
    },
    onSearchClick() {
      this.$emit('search-click')
    },
    goToCategories() {
      this.$emit('go-to-categories')
    },
  },
})
</script>
