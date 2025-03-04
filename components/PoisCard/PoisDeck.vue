<script setup lang="ts">
import type { ApiPoi } from '~/lib/apiPois'
import PoiCard from '~/components/PoisCard/PoiCard.vue'
import PoiCardLight from '~/components/PoisCard/PoiCardLight.vue'

withDefaults(defineProps<{
  explorerModeEnabled?: boolean
  favoritesModeEnabled?: boolean
  pois: ApiPoi[]
  isCardLight: boolean
}>(), {
  explorerModeEnabled: false,
  favoritesModeEnabled: false,
})

defineEmits<{
  (e: 'exploreClick', poi: ApiPoi): void
  (e: 'favoriteClick', poi: ApiPoi): void
  (e: 'zoomClick', poi: ApiPoi): void
}>()
</script>

<template>
  <div v-if="isCardLight" class="pois-deck">
    <component
      :is="PoiCardLight"
      v-for="item in pois"
      :key="item.properties.metadata.id"
      :poi="item"
      class="tw-grow-1 poi-deck"
    />
  </div>
  <div v-else class="pois-deck">
    <component
      :is="PoiCard"
      v-for="item in pois"
      :key="item.properties.metadata.id"
      :can-close="false"
      :poi="item"
      class="tw-grow-1 poi-deck"
      :explorer-mode-enabled="explorerModeEnabled"
      :favorites-mode-enabled="favoritesModeEnabled"
      @explore-click="$emit('exploreClick', $event)"
      @favorite-click="$emit('favoriteClick', $event)"
      @zoom-click="$emit('zoomClick', $event)"
    />
  </div>
</template>

<style lang="css" scoped>
.pois-deck {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
