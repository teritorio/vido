<template>
  <div class="w-full h-full">
    <Map class="absolute" />

    <div
      class="fixed top-0 bottom-0 flex flex-col h-full max-w-lg p-4 space-y-4 pointer-events-none"
    >
      <header-search class="flex-none pointer-events-auto" />
      <categories class="flex-1 pointer-events-auto" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import Categories from '@/components/Categories.vue'
import HeaderSearch from '@/components/HeaderSearch.vue'
import Map from '@/components/Map.vue'

export default Vue.extend({
  components: {
    Map,
    Categories,
    HeaderSearch,
  },
})
</script>
