<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import SearchResultBlock from '~/components/Search/SearchResultBlock.vue'
import type { SearchResult } from '~/lib/apiSearch'

const props = defineProps<{
  itemsCartocode: {
    id: number
    label: string
  }[]
  itemsMenuItems: {
    id: number
    label: string
    icon: string
    filter_property: string | undefined
    filter_value: string | boolean | undefined
  }[]
  itemsPois: {
    id: number
    label: string
    icon: string | undefined
    small: string | undefined
  }[]
  itemsAddresses: {
    id: number
    label: string
    icon: string
  }[]
}>()

defineEmits<{
  (e: 'reset'): void
  (e: 'cartocodeClick', searchResult: SearchResult): void
  (e: 'categoryClick', searchResult: SearchResult): void
  (e: 'poiClick', searchResult: SearchResult): void
  (e: 'addressClick', searchResult: SearchResult): void
}>()

const results = computed(() => {
  return (
    props.itemsCartocode.length
    + props.itemsMenuItems.length
    + props.itemsPois.length
    + props.itemsAddresses.length
  )
})
</script>

<template>
  <VBtn
    type="button"
    variant="text"
    :style="{ alignSelf: 'flex-start' }"
    @click="$emit('reset')"
  >
    <FontAwesomeIcon
      icon="arrow-left"
      size="lg"
    />
  </VBtn>

  <div class="search-results">
    <SearchResultBlock
      v-if="itemsCartocode.length > 0"
      type="cartocode"
      icon="layer-group"
      :label="$t('headerMenu.cartocode')"
      :items="itemsCartocode"
      @item-click="$emit('cartocodeClick', $event)"
    />

    <SearchResultBlock
      v-if="itemsMenuItems.length > 0"
      type="category"
      icon="layer-group"
      :label="$t('headerMenu.categories')"
      :items="itemsMenuItems"
      @item-click="$emit('categoryClick', $event)"
    />

    <SearchResultBlock
      v-if="itemsPois.length > 0"
      type="pois"
      icon="map-marker-alt"
      :label="$t('headerMenu.pois')"
      :items="itemsPois"
      @item-click="$emit('poiClick', $event)"
    />

    <SearchResultBlock
      v-if="itemsAddresses.length > 0"
      type="addresse"
      icon="home"
      :label="$t('headerMenu.addresses')"
      :items="itemsAddresses"
      @item-click="$emit('addressClick', $event)"
    />

    <p v-if="results === 0">
      {{ $t('headerMenu.noResult') }}
    </p>
  </div>
</template>
