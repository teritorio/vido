<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { storeToRefs } from 'pinia'
import { VDialog } from 'vuetify/components/VDialog'
import IconButton from '~/components/UI/IconButton.vue'
import { useSiteStore } from '~/stores/site'
import { menuStore as useMenuStore } from '~/stores/menu'
import { mapStore as useMapStore } from '~/stores/map'
import NavMenu from '~/components/MainMap/NavMenu.vue'
import FavoriteMenu from '~/components/MainMap/FavoriteMenu.vue'
import type { ApiPoi } from '~/lib/apiPois'
import Search from '~/components/Search/Search.vue'
import type { MenuItem } from '~/lib/apiMenu'
import HomeMenu from '~/components/Home/Menu.vue'

const emit = defineEmits<{
  (e: 'exploreClick', poi: ApiPoi): void
  (e: 'favoriteClick', poi: ApiPoi): void
  (e: 'toggleSearchMode'): void
  (e: 'toggleFavoriteMode'): void
  (e: 'toggleNoteBookMode'): void
  (e: 'zoomClick', poi: ApiPoi): void
  (e: 'selectFeature', poi: ApiPoi): void
}>()

const { favoritesModeEnabled } = storeToRefs(useSiteStore())
const { apiMenuCategory } = storeToRefs(useMenuStore())
const { center } = storeToRefs(useMapStore())

const menuItemsToIcons = computed(() => {
  const resources: Record<MenuItem['id'], string> = {}
  Object.values(apiMenuCategory.value || {}).forEach((sc) => {
    resources[sc.id] = (sc.menu_group || sc.link || sc.category).icon
  })
  return resources
})
</script>

<template>
  <nav role="navigation" aria-label="Main navigation">
    <ul role="menubar">
      <li role="none">
        <VDialog
          :fullscreen="true"
          :scrim="false"
          transition="dialog-bottom-transition"
          max-width="80rem"
        >
          <template #activator="{ props: activatorProps }">
            <IconButton
              role="menuitem"
              label="Afficher le menu de recherche"
              class="tw-w-11 tw-h-11 tw-pointer-events-auto"
              v-bind="activatorProps"
            >
              <FontAwesomeIcon
                icon="search"
                class="tw-text-zinc-800"
                size="lg"
              />
            </IconButton>
          </template>
          <template #default="{ isActive }">
            <VCard title="Menu de recherche">
              <template #prepend>
                <VBtn
                  text="Ferme le menu de recherche"
                  variant="text"
                  size="xsmall"
                  @click="isActive.value = false"
                >
                  <FontAwesomeIcon
                    icon="arrow-left"
                    class="tw-text-zinc-800"
                    size="lg"
                  />
                </VBtn>
              </template>
              <template #title>
                <Search
                  :menu-to-icon="menuItemsToIcons"
                  :map-center="center"
                  @select-feature="emit('selectFeature', $event)"
                />
              </template>
              <template #text>
                <HomeMenu menu-block="MenuBlockBottom" />
              </template>
            </VCard>
          </template>
        </VDialog>
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
