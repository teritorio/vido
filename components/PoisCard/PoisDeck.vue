<template>
  <div class="tw-flex tw-justify-between tw-flex-wrap tw-gap-6">
    <component
      :is="poisCard"
      v-for="item in pois"
      :key="item.properties.metadata.id"
      :poi="item"
      :class="[
        'tw-grow-1 poi-deck',
        !isFavorite(item.properties.metadata.id) &&
          'tw-bg-zinc-200 tw-opacity-70',
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
import { PropType } from 'vue'

import { defineNuxtComponent } from '#app'
import PoiCard from '~/components/PoisCard/PoiCard.vue'
import PoiCardLight from '~/components/PoisCard/PoiCardLight.vue'
import { ApiPoi, ApiPoiId } from '~/lib/apiPois'

export default defineNuxtComponent({
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

  emits: {
    'zoom-click': (_poi: ApiPoi) => true,
    'explore-click': (_poi: ApiPoi) => true,
    'favorite-click': (_poi: ApiPoi) => true,
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
