<template>
  <div class="flex justify-between flex-wrap gap-6">
    <component
      :is="poisCard"
      v-for="item in pois"
      :key="item.properties.metadata.id"
      :poi="item"
      :class="[
        'grow-1',
        !isFavorite(item.properties.metadata.id) && 'bg-zinc-200 opacity-70',
      ]"
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
import PoiCardLight from '~/components/PoisCard/PoiCardLight.vue'
import { ApiPoi, ApiPoiId } from '~/lib/apiPois'

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
    selectedPoiIds: {
      type: Array as PropType<ApiPoiId[]> | undefined,
      default: undefined,
    },
    poisCard: {
      type: String as PropType<'PoiCard' | 'PoiCardLight'>,
      default: 'PoiCard',
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

  methods: {
    isFavorite(id: ApiPoiId): boolean {
      return (
        this.selectedPoiIds === undefined || this.selectedPoiIds.includes(id)
      )
    },
  },
})
</script>
