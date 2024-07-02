<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { ApiPoi } from '~/lib/apiPois'
import PoiCard from '~/components/PoisCard/PoiCard.vue'
import PoiCardLight from '~/components/PoisCard/PoiCardLight.vue'
import { favoriteStore as useFavoriteStore } from '~/stores/favorite'

defineProps<{
  explorerModeEnabled: boolean
  favoritesModeEnabled: boolean
  pois: ApiPoi[]
  isCardLight: boolean
}>()

defineEmits<{
  (e: 'exploreClick', poi: ApiPoi): void
  (e: 'favoriteClick', poi: ApiPoi): void
  (e: 'zoomClick', poi: ApiPoi): void
}>()

const { favoritesIds, favoriteAddresses } = storeToRefs(useFavoriteStore())
function isFavorite(id: number) {
  return favoritesIds.value.includes(id) || favoriteAddresses.value.has(id.toString())
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
