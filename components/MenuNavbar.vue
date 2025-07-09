<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { storeToRefs } from 'pinia'
import type { ApiPoi } from '~/lib/apiPois'
import { useSiteStore } from '~/stores/site'
import { menuStore as useMenuStore } from '~/stores/menu'
import { useSearchStore } from '~/stores/search'
import { useNavigationStore } from '~/stores/navigation'
import IconButton from '~/components/UI/IconButton.vue'
import NavMenu from '~/components/MainMap/NavMenu.vue'
import FavoriteMenu from '~/components/MainMap/FavoriteMenu.vue'
import SearchInput from '~/components/Search/SearchInput.vue'
import SearchResults from '~/components/Search/SearchResults.vue'
import HomeMenu from '~/components/Home/Menu.vue'
import SelectedCategories from '~/components/Home/SelectedCategories.vue'
import UIButton from '~/components/UI/UIButton.vue'

const emit = defineEmits<{
  (e: 'exploreClick', poi: ApiPoi): void
  (e: 'favoriteClick', poi: ApiPoi): void
  (e: 'toggleSearchMode'): void
  (e: 'toggleFavoriteMode'): void
  (e: 'toggleNoteBookMode'): void
  (e: 'zoomClick', poi: ApiPoi): void
}>()

const navigationStore = useNavigationStore()
const { favoritesModeEnabled } = storeToRefs(useSiteStore())
const { selectedCategories } = storeToRefs(useMenuStore())
const searchStore = useSearchStore()
const {
  itemsCartocode,
  itemsMenuItems,
  itemsPois,
  itemsAddresses,
  resultsCount,
  firstVisitCookie,
} = storeToRefs(searchStore)

onBeforeUnmount(() => searchStore.dispose())

onMounted(() => {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
})
</script>

<template>
  <nav role="navigation" :aria-label="$t('menuNavbar.label')">
    <ul role="menubar">
      <li role="none">
        <VDialog
          :fullscreen="true"
          :scrim="false"
          :scrollable="false"
          transition="dialog-bottom-transition"
          max-width="80rem"
        >
          <template #activator="{ props: activatorProps }">
            <IconButton
              role="menuitem"
              :label="$t('menuNavbar.actions.search.open')"
              class="tw-w-11 tw-h-11 tw-pointer-events-auto"
              v-bind="activatorProps"
              @click="searchStore.setFirstVisit"
            >
              <VTooltip
                v-model="firstVisitCookie"
                :text="$t('menuNavbar.actions.search.tooltip')"
                :open-on-hover="false"
                :open-on-click="false"
                :open-on-focus="false"
                :attach="$el"
                activator="parent"
                location="top"
              />
              <FontAwesomeIcon
                icon="search"
                class="tw-text-zinc-800"
                size="lg"
              />
            </IconButton>
          </template>
          <template #default="{ isActive }">
            <UIButton
              class="close-button"
              color="#ffffff"
              icon="times"
              :title="$t('menuNavbar.actions.search.close')"
              @click="
                isActive.value = false;
                navigationStore.resetNavigation();
              "
            />
            <VCard>
              <template #title>
                <SearchInput />
              </template>
              <template #text>
                <SearchResults
                  v-if="resultsCount"
                  :items-cartocode="itemsCartocode"
                  :items-menu-items="itemsMenuItems"
                  :items-pois="itemsPois"
                  :items-addresses="itemsAddresses"
                  @cartocode-click="
                    searchStore.onCartocodeClick($event);
                    isActive.value = false;
                  "
                  @category-click="
                    searchStore.onCategoryClick($event);
                    isActive.value = false;
                  "
                  @poi-click="
                    searchStore.onPoiClick($event);
                    isActive.value = false;
                  "
                  @address-click="
                    searchStore.onAddressClick($event);
                    isActive.value = false;
                  "
                />
                <template v-else>
                  <HomeMenu class="home-menu" menu-block="MenuBlockBottom" />
                  <SelectedCategories
                    v-if="selectedCategories?.length"
                    :categories="selectedCategories"
                    @show-map="
                      isActive.value = false;
                      navigationStore.resetNavigation();
                    "
                  />
                </template>
              </template>
            </VCard>
          </template>
        </VDialog>
      </li>
      <li role="none">
        <FavoriteMenu
          v-if="favoritesModeEnabled"
          role="menuitem"
          @explore-click="emit('exploreClick', $event)"
          @favorite-click="emit('favoriteClick', $event)"
          @toggle-favorite-mode="emit('toggleFavoriteMode')"
          @toggle-note-book-mode="emit('toggleNoteBookMode')"
          @zoom-click="emit('zoomClick', $event)"
        />
      </li>
      <li role="none">
        <NavMenu data-testid="nav-menu" role="menuitem" />
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

:deep(.v-card-text > .home-menu) {
  overflow-y: auto;
}

:deep(.v-card-text) {
  display: grid;
  grid-template-rows: 1fr auto;
  height: 100%;
  height: calc(var(--vh, 1vh) * 100 - 84px);
  gap: 0.5rem;
}

:deep(.v-card-item) {
  border: 2px solid #F4F4F5;
}

:deep(.v-card-item__content) {
  margin-bottom: 14px;
}

:deep(.v-card-title) {
  max-width: calc(100% - 56px);
}

:deep(.close-button) {
  background-color: rgb(0 0 0 / 55%);
  border-radius: 0 0 0 8px;
  right: 0;
  top: 0;
  border: 0;
  position: absolute;
  z-index: 1;
}

:deep(.close-button svg) {
  width: 24px;
  height: 24px;
}
</style>
