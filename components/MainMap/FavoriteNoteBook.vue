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
    <PoisDeck
      :pois="favs"
      :notebook="true"
      :explorer-mode-enabled="explorerModeEnabled"
      :favorites-mode-enabled="true"
      @explore-click="$emit('explore-click', $event)"
      @favorite-click="$emit('favorite-click', $event)"
      @zoom-click="$emit('zoom-click', $event)"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import PoisDeck from '~/components/PoisCard/PoisDeck.vue'
import { ApiPoi } from '~/lib/apiPois'

export default Vue.extend({
  components: {
    PoisDeck,
  },
  props: {
    favs: {
      type: Array as PropType<ApiPoi[]>,
      default: undefined,
    },
    explorerModeEnabled: {
      type: Boolean,
      required: true,
    },
  },
})
</script>
