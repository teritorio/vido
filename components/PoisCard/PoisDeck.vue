<template>
  <div class="flex justify-between flex-wrap gap-6">
    <component
      :is="poisCard"
      v-for="item in pois"
      :key="item.id"
      :poi="item"
      :notebook="notebook"
      class="grow-1"
      :explorer-mode-enabled="explorerModeEnabled"
      :favorites-mode-enabled="favoritesModeEnabled"
      @explore-click="$emit('explore-click', $event)"
      @favorite-click="$emit('favorite-click', $event)"
      @zoom-click="$emit('zoom-click', $event)"
    />
    <div v-if="!pois" class="no-result">
      {{ $tc('headerMenu.noResult') }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import PoiCard from '~/components/PoisCard/PoiCard.vue'
import PoiCardLight from '~/components/PoisCard/PoiCardLight.vue'
import { ApiPoi } from '~/lib/apiPois'

export default Vue.extend({
  components: {
    PoiCard,
    PoiCardLight,
  },
  props: {
    pois: {
      type: Array as PropType<ApiPoi[]>,
      required: true,
    },
    poisCard: {
      type: String as PropType<'PoiCard' | 'PoiCardLight'>,
      default: 'PoiCard',
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
