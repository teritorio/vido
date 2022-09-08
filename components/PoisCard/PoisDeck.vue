<template>
  <div class="flex justify-between flex-wrap max-h-full overflow-y-auto">
    <PoiCard
      v-for="item in pois"
      :key="item.id"
      :poi="item"
      :notebook="notebook"
      class="grow-0 shrink-0 m-2"
      :explorer-mode-enabled="explorerModeEnabled"
      :favorites-mode-enabled="favoritesModeEnabled"
      @explore-click="$emit('explore-click', $event)"
      @favorite-click="$emit('favorite-click', $event)"
      @zoom-click="$emit('zoom-click', $event)"
    />
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
    pois: {
      type: Array as PropType<ApiPoi[]>,
      default: undefined,
    },
    notebook: {
      type: Boolean,
      default: false,
    },
    explorerModeEnabled: {
      type: Boolean,
      required: true,
    },
    favoritesModeEnabled: {
      type: Boolean,
      required: true,
    },
  },
})
</script>
