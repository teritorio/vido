<template>
  <div>
    <div
      class="flex justify-between items-center py-4 px-1 sm:px-6 sticky top-0 z-50 bg-white"
    >
      <p class="text-lg">{{ $tc('favorites.notebook.title') }}</p>
      <button
        class="flex items-center border-solid border-zinc-300 border-2 bg-white focus:outline-none focus-visible:bg-zinc-100 hover:bg-zinc-100 py-2 px-4 rounded-full"
        @click="$emit('on-close')"
      >
        <font-awesome-icon
          ref="menu_icon"
          icon="times"
          class="text-zinc-500 sm:mr-2"
          size="sm"
        />
        <p class="hidden sm:block">{{ $tc('favorites.notebook.close') }}</p>
      </button>
    </div>
    <div class="flex justify-between flex-wrap max-h-full overflow-y-auto">
      <PoiCard
        v-for="item in favs"
        :key="item.id"
        :poi="item"
        :notebook="true"
        class="grow-0 shrink-0 m-2"
        @explore-click="$emit('explore-click', $event)"
        @favorite-click="$emit('favorite-click', $event)"
        @zoom-click="$emit('zoom-click', $event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import PoiCard from '~/components/PoisCard/PoiCard.vue'
import { ApiPoi } from '~/lib/apiPois'

export default Vue.extend({
  components: {
    PoiCard,
  },
  props: {
    favs: {
      type: Array as PropType<ApiPoi[]>,
      default: undefined,
    },
  },
})
</script>
