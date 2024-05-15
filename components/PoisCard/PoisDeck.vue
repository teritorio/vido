<script setup lang="ts">
import type { ApiPoi, ApiPoiId } from '~/lib/apiPois'
import PoiCard from '~/components/PoisCard/PoiCard.vue'
import PoiCardLight from '~/components/PoisCard/PoiCardLight.vue'

const props = defineProps<{
  explorerModeEnabled: boolean
  favoritesModeEnabled: boolean
  pois: ApiPoi[]
  isCardLight: boolean
  selectedPoiIds?: ApiPoiId[]
}>()

defineEmits<{
  (e: 'exploreClick', poi: ApiPoi): void
  (e: 'favoriteClick', poi: ApiPoi): void
  (e: 'zoomClick', poi: ApiPoi): void
}>()

function isFavorite(id: ApiPoiId): boolean {
  return (
    props.selectedPoiIds === undefined || props.selectedPoiIds.includes(id)
  )
}
</script>

<template>
  <div class="tw-flex tw-justify-between tw-flex-wrap tw-gap-6">
    <component
      :is="isCardLight ? PoiCardLight : PoiCard"
      v-for="item in pois"
      :key="item.properties.metadata.id"
      :poi="item"
      class="tw-grow-1 poi-deck" :class="[
        !isFavorite(item.properties.metadata.id)
          && 'tw-bg-zinc-200 tw-opacity-70',
      ]"
      :explorer-mode-enabled="explorerModeEnabled"
      :favorites-mode-enabled="favoritesModeEnabled"
      @explore-click="$emit('exploreClick', $event)"
      @favorite-click="$emit('favoriteClick', $event)"
      @zoom-click="$emit('zoomClick', $event)"
    />
  </div>
</template>
