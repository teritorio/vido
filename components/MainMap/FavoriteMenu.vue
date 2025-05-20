<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { storeToRefs } from 'pinia'
import { VDialog } from 'vuetify/components/VDialog'
import FavoriteNoteBook from '~/components/MainMap/FavoriteNoteBook.vue'
import Badge from '~/components/UI/Badge.vue'
import FavoriteIcon from '~/components/UI/FavoriteIcon.vue'
import type { ApiPoi } from '~/lib/apiPois'
import { mapStore as useMapStore } from '~/stores/map'
import { favoriteStore as useFavoriteStore } from '~/stores/favorite'

const emit = defineEmits<{
  (e: 'exploreClick', poi: ApiPoi): void
  (e: 'favoriteClick', poi: ApiPoi): void
  (e: 'toggleFavoriteMode'): void
  (e: 'toggleNoteBookMode'): void
  (e: 'zoomClick', poi: ApiPoi): void
}>()

const device = useDevice()
const notebookModal = ref<boolean>(false)

const mapStore = useMapStore()
const { isModeFavorites } = storeToRefs(mapStore)
const { favoriteCount } = storeToRefs(useFavoriteStore())

function onExploreClick(poi: ApiPoi) {
  notebookModal.value = false
  emit('exploreClick', poi)
}

function onClose() {
  notebookModal.value = false
  emit('toggleNoteBookMode')
}

function onZoomClick(poi: ApiPoi) {
  notebookModal.value = false
  emit('zoomClick', poi)
}

const { $tracking } = useNuxtApp()
async function toggleNoteBookMode() {
  $tracking({
    type: 'notebook_event',
    event: 'open',
  })

  notebookModal.value = true

  emit('toggleNoteBookMode')
}
</script>

<template>
  <section>
    <div class="tw-flex tw-right-10 tw-pointer-events-auto">
      <button
        ref="menu"
        type="button"
        class="tw-relative tw-space-x-1 tw-text-sm tw-font-medium tw-shadow-md tw-outline-none md:tw-px-5 tw-w-11 md:tw-w-auto tw-h-11 focus:tw-outline-none tw-shrink-0 border-solid tw-border-r tw-border-zinc-400 tw-rounded-l-full tw-z-10"
        :class="[
          isModeFavorites && 'tw-bg-blue-500 hover:tw-bg-blue-400 focus-visible:tw-bg-blue-400 tw-text-white',
          !isModeFavorites && 'tw-bg-white hover:tw-bg-zinc-100 focus-visible:tw-bg-zinc-100 tw-text-zinc-800',
        ]"
        @click="emit('toggleFavoriteMode')"
      >
        <FavoriteIcon :is-active="isModeFavorites" />
        <span class="tw-hidden md:tw-inline favorite-title">
          {{ $t('favorites.title') }}
        </span>
        <ClientOnly>
          <Badge
            v-if="favoriteCount > 0"
            id="favourites_counter"
            class="tw-absolute tw-top-1/2 tw-right-0 -tw-translate-y-1/2 tw-translate-x-1/2"
            :items="favoriteCount"
          />
        </ClientOnly>
      </button>
      <button
        id="open_favourites_notebook"
        type="button"
        class="tw-pl-2 tw-relative tw-space-x-1 tw-text-sm tw-font-medium tw-shadow-md tw-outline-none md:tw-px-5 tw-w-11 md:tw-w-auto tw-h-11 focus:tw-outline-none tw-shrink-0 tw-rounded-r-full tw-bg-white hover:tw-bg-zinc-100 focus-visible:tw-bg-zinc-100 tw-text-zinc-800"
        :class="[favoriteCount === 0 && 'tw-bg-zinc-100 tw-cursor-not-allowed']"
        :disabled="favoriteCount === 0"
        @click="toggleNoteBookMode"
      >
        <FontAwesomeIcon
          ref="menu_icon"
          icon="book-open"
          class="tw-text-zinc-500 tw-mr-2"
          size="lg"
        />
        <span class="tw-hidden md:tw-inline favorite-title">
          {{ $t('favorites.menu_notebook') }}
        </span>
      </button>
    </div>

    <div>
      <VDialog
        v-model="notebookModal"
        :fullscreen="device.smallScreen"
        max-width="80rem"
      >
        <FavoriteNoteBook
          @explore-click="onExploreClick"
          @favorite-click="emit('favoriteClick', $event)"
          @zoom-click="onZoomClick"
          @on-close="onClose"
        />
      </VDialog>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.favorite-title {
  @media (width <= 860px) {
    @apply tw-hidden;
  }
}
</style>
