<template>
  <div class="w-full h-full overflow-hidden">
    <Map class="absolute w-full h-full" />

    <div
      class="fixed top-0 bottom-0 flex flex-col w-full p-4 space-y-4 pointer-events-none md:w-1/2 xl:w-1/3"
    >
      <div
        class="flex-grow-0 flex-shrink-0 bg-white rounded-lg shadow-md pointer-events-auto"
      >
        <header-search />
      </div>

      <div class="flex-grow-0 flex-shrink-0 space-y-4 pointer-events-auto">
        <categories />
      </div>

      <div
        class="px-5 overflow-y-auto bg-white rounded-lg shadow-md pointer-events-auto"
      >
        <sub-categories />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import Categories from '@/components/Categories.vue'
import HeaderSearch from '@/components/HeaderSearch.vue'
import Map from '@/components/Map.vue'
import SubCategories from '@/components/SubCategories.vue'

export default Vue.extend({
  components: {
    Map,
    Categories,
    HeaderSearch,
    SubCategories,
  },
})
</script>
