<template>
  <div>
    <div
      class="flex justify-between items-center py-4 px-1 sm:px-6 sticky top-0 z-50 bg-white"
    >
      <p class="text-lg">{{ $tc('favorites.notebook.title') }}</p>
      <button
        class="flex items-center border-solid border-gray-300 border-2 bg-white focus:outline-none focus-visible:bg-gray-100 hover:bg-gray-100 py-2 px-4 rounded-full"
        @click="onClose"
      >
        <font-awesome-icon
          ref="menu_icon"
          icon="times"
          class="text-gray-500 sm:mr-2"
          size="sm"
        />
        <p class="hidden sm:block">{{ $tc('favorites.notebook.close') }}</p>
      </button>
    </div>
    <div class="flex justify-between flex-wrap max-h-full overflow-y-auto">
      <MapPoiToast
        v-for="item in favs"
        :key="item.id"
        :poi="item"
        :notebook="true"
        class="flex-grow-0 flex-shrink-0 m-2"
        @explore-click="exploreAroundSelectedPoi"
        @favorite-click="toggleFavorite"
        @zoom-click="goToSelectedPoi"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import MapPoiToast from '@/components/MainMap/MapPoiToast.vue'

export default Vue.extend({
  components: {
    MapPoiToast,
  },
  props: {
    favs: {
      type: Array,
      default: undefined,
    },
    onClose: {
      type: Function,
      required: true,
    },
    exploreAroundSelectedPoi: {
      type: Function,
      required: true,
    },
    toggleFavorite: {
      type: Function,
      required: true,
    },
    goToSelectedPoi: {
      type: Function,
      required: true,
    },
  },
})
</script>
