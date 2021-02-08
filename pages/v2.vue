<template>
  <div class="fixed inset-x-0 inset-y-0 w-full h-full">
    <Map class="h-full" />

    <div class="absolute flex justify-center w-full top-4">
      <div class="flex flex-col space-y-2">
        <div
          class="flex items-center overflow-hidden bg-white rounded-lg shadow-md"
        >
          <h1 class="px-5 py-3">
            <Logo class="w-20 h-auto" />
          </h1>

          <form class="contents">
            <input
              class="h-full px-5 font-medium text-gray-500 placeholder-gray-600 bg-gray-100 appearance-none w-80 hover:bg-white focus:bg-white text-md"
              placeholder="Rechercher dans les Landes"
            />
          </form>
        </div>

        <div
          class="flex items-center px-5 py-3 bg-white rounded-lg shadow-md justify-evenly"
        >
          <LeisureParkGardenIcon
            class="w-12 h-12 text-green-300 fill-current"
          />
        </div>
      </div>
    </div>
    <!-- <div class="absolute flex justify-center w-full top-4">
      <div
        class="flex items-center max-w-xl px-5 py-3 space-x-5 bg-white rounded-lg shadow-md"
      >
        <h1>
          <Logo class="w-20 h-auto" />
        </h1>

        <form class="flex space-x-3">
          <input
            class="flex-1 w-full px-5 py-1 text-gray-700 placeholder-gray-800 bg-gray-100 border border-transparent rounded-full appearance-none text-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Recherche..."
          />
        </form>
      </div>
    </div> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import LeisureParkGardenIcon from '@/assets/leisure-park-garden•.svg?inline'
// import ClosedMention from '@/components/ClosedMention.vue'
import Logo from '@/components/Logo.vue'
import Map from '@/components/Map.vue'
// import OpenMention from '@/components/OpenMention.vue'

export default Vue.extend({
  components: {
    // ClosedMention,
    LeisureParkGardenIcon,
    Logo,
    Map,
    // OpenMention,
  },
})
</script>
