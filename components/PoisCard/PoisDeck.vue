<script setup lang="ts">
import type { Poi } from '~/types/local/poi'
import PoiCard from '~/components/PoisCard/PoiCard.vue'
import PoiCardLight from '~/components/PoisCard/PoiCardLight.vue'
import { favoriteStore as useFavoriteStore } from '~/stores/favorite'
import type { PoiUnion } from '~/types/local/poi-deps'

defineProps<{
  pois: PoiUnion[]
  isCardLight: boolean
}>()

const emit = defineEmits<{
  (e: 'exploreClick', poi: Poi): void
  (e: 'favoriteClick', poi: Poi): void
  (e: 'zoomClick', poi: Poi): void
}>()

const favoriteStore = useFavoriteStore()
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
      :poi="item as Poi"
      class="tw-grow-1 poi-deck"
      :class="[
        !favoriteStore.isFavorite(item.properties.metadata.id)
          && 'tw-bg-zinc-200 tw-opacity-70',
      ]"
      @explore-click="emit('exploreClick', $event)"
      @favorite-click="emit('favoriteClick', $event)"
      @zoom-click="emit('zoomClick', $event)"
    />
  </div>
</template>

<style lang="css" scoped>
.pois-deck {
  display: flex;
  flex-flow: column wrap;
  gap: 1rem;
}
</style>
