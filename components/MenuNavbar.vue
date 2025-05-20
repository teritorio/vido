<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { storeToRefs } from 'pinia'
import IconButton from '~/components/UI/IconButton.vue'
import { useSiteStore } from '~/stores/site'
import NavMenu from '~/components/MainMap/NavMenu.vue'
import FavoriteMenu from '~/components/MainMap/FavoriteMenu.vue'
import type { ApiPoi } from '~/lib/apiPois'

const emit = defineEmits<{
  (e: 'exploreClick', poi: ApiPoi): void
  (e: 'favoriteClick', poi: ApiPoi): void
  (e: 'toggleSearchMode'): void
  (e: 'toggleFavoriteMode'): void
  (e: 'toggleNoteBookMode'): void
  (e: 'zoomClick', poi: ApiPoi): void
}>()

const { favoritesModeEnabled } = storeToRefs(useSiteStore())
</script>

<template>
  <nav role="navigation" aria-label="Main navigation">
    <ul role="menubar">
      <li role="none">
        <IconButton
          role="menuitem"
          label="Menu de recherche"
          class="tw-w-11 tw-h-11 tw-pointer-events-auto"
          @click="emit('toggleSearchMode')"
        >
          <FontAwesomeIcon
            icon="search"
            class="tw-text-zinc-800"
            size="lg"
          />
        </IconButton>
      </li>
      <li role="none">
        <FavoriteMenu
          v-if="favoritesModeEnabled"
          @explore-click="emit('exploreClick', $event)"
          @favorite-click="emit('favoriteClick', $event)"
          @toggle-favorite-mode="emit('toggleFavoriteMode')"
          @toggle-note-book-mode="emit('toggleNoteBookMode')"
          @zoom-click="emit('zoomClick', $event)"
        />
      </li>
      <li>
        <NavMenu id="nav-menu" />
      </li>
    </ul>
  </nav>
</template>

<style lang="css" scoped>
nav {
  position: absolute;
  bottom: 5rem;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
}

ul {
  display: flex;
  gap: 1rem;
}
</style>
