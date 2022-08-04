<template>
  <aside
    class="hidden md:flex flex-col absolute bottom-0 overflow-y-hidden pointer-events-auto sm:relative inset-auto h-max max-h-full box-border space-y-4 p-2 box-border"
  >
    <div
      :class="[
        'items-center justify-between hidden md:flex rounded-xl shadow-md px-5 py-4',
        isModeExplorerOrFavorites ? 'bg-blue-500 text-white' : 'bg-white',
      ]"
    >
      <h1 v-if="!isModeExplorerOrFavorites">
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
        v-if="!isModeExplorerOrFavorites"
        type="button"
        class="flex-grow relative pointer-events-auto w-full ml-6"
        @click="onSearchClick"
      >
        <div class="relative w-full">
          <input
            ref="search"
            value=""
            class="w-full px-5 py-3 font-medium text-zinc-700 placeholder-zinc-500 bg-zinc-100 border-none rounded-full outline-none appearance-none focus:outline-none focus:ring focus:ring-zinc-300"
            :placeholder="$tc('headerMenu.search')"
            type="text"
            @focus="$tracking({ type: 'search' })"
          />
          <div class="absolute inset-y-0 right-0 px-5 py-3 text-zinc-800">
            <font-awesome-icon icon="search" />
          </div>
        </div>
      </button>

      <div v-else class="flex items-center ml-2">
        <button
          type="button"
          class="flex shrink-0 items-center justify-center w-10 h-10 text-2xl font-bold transition-all rounded-full outline-none cursor-pointer focus:outline-none hover:bg-blue-700 focus:bg-blue-700"
          @click="goToCategories"
        >
          <font-awesome-icon icon="arrow-left" class="text-white" size="xs" />
        </button>
        <p class="ml-2">
          {{
            $tc(
              isModeFavorites
                ? 'headerMenu.backToMenuFavorites'
                : 'headerMenu.backToMenuExplorer'
            )
          }}
        </p>
      </div>
    </div>

    <template v-if="!isModeExplorerOrFavorites">
      <HeaderRootCategories
        v-for="(category, index) in categoryRootCategories"
        :key="category.id"
        :class="[
          'pointer-events-auto 2xl:max-h-screen overflow-y-auto bg-white rounded-xl shadow-md px-5 py-4',
          !(index > 0 || categoryRootCategories.length < 2) && 'shrink-0',
          (index > 0 || categoryRootCategories.length < 2) && 'max-h-full',
        ]"
        :categories-activesubs-count="categoriesActivesubsCount"
        :category-id="category.id"
        @category-click="onCategoryClick"
      />
    </template>
  </aside>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters } from 'vuex'

import HeaderRootCategories from '~/components/Categories/HeaderRootCategories.vue'
import { Category } from '~/lib/apiMenu'

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
    categoriesActivesubsCount: {
      type: Object as PropType<{ [id: string]: number }>,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters({
      isModeFavorites: 'map/isModeFavorites',
      isModeExplorerOrFavorites: 'map/isModeExplorerOrFavorites',
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
