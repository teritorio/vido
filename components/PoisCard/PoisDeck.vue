<script setup lang="ts">
import type { ApiPoi } from '~/lib/apiPois'
import PoiCard from '~/components/PoisCard/PoiCard.vue'
import PoiCardLight from '~/components/PoisCard/PoiCardLight.vue'

withDefaults(defineProps<{
  favoritesModeEnabled?: boolean
  pois: ApiPoi[]
  isCardLight: boolean
}>(), {
  favoritesModeEnabled: false,
})

defineEmits<{
  (e: 'exploreClick', poi: ApiPoi): void
  (e: 'favoriteClick', poi: ApiPoi): void
  (e: 'zoomClick', poi: ApiPoi): void
}>()
</script>

<template>
  <div v-if="isCardLight" class="tw-flex tw-justify-between tw-flex-wrap tw-gap-6">
    <component
      :is="PoiCardLight"
      v-for="item in pois"
      :key="item.properties.metadata.id"
      :poi="item"
      class="tw-grow-1 poi-deck"
    />
  </div>
  <div v-else class="tw-flex tw-justify-between tw-flex-wrap tw-gap-6">
    <component
      :is="PoiCard"
      v-for="item in pois"
      :key="item.properties.metadata.id"
      :can-close="false"
      :poi="item"
      class="tw-grow-1 poi-deck"
      :favorites-mode-enabled="favoritesModeEnabled"
      @explore-click="$emit('exploreClick', $event)"
      @favorite-click="$emit('favoriteClick', $event)"
      @zoom-click="$emit('zoomClick', $event)"
    />
  </div>
</template>
