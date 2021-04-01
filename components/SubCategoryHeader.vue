<template>
  <header
    class="fixed top-0 bottom-0 flex flex-col w-full h-full max-w-md p-4 space-y-4 pointer-events-none"
  >
    <aside class="px-5 py-4 bg-white shadow-md pointer-events-auto rounded-xl">
      <button
        type="button"
        class="flex items-center justify-center w-10 h-10 text-2xl font-bold transition-all rounded-full outline-none cursor-pointer focus:outline-none hover:bg-gray-100 focus:bg-gray-100"
        @click="onGoBackClick"
      >
        <font-awesome-icon icon="arrow-left" class="text-gray-800 fa-xs" />
      </button>

      <HeaderSubCategories
        class="flex-1 pointer-events-auto"
        :categories="categories"
        :on-category-click="onCategoryClick"
      />
    </aside>
  </header>
</template>

<script lang="ts">
import Vue from 'vue'

import HeaderSubCategories from '~/components/HeaderSubCategories.vue'

export default Vue.extend({
  components: {
    HeaderSubCategories,
  },
  props: {
    categories: {
      type: Array,
      required: true,
    },
    onCategoryClick: {
      type: Function,
      required: true,
    },
    onGoBackClick: {
      type: Function,
      required: true,
    },
  },
})
</script>
