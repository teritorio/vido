<template>
  <section>
    <div class="tw-flex tw-right-10 tw-pointer-events-auto">
      <button
        ref="menu"
        type="button"
        :class="[
          'tw-relative tw-space-x-1 tw-text-sm tw-font-medium tw-shadow-md tw-outline-none md:tw-px-5 tw-w-11 md:tw-w-auto tw-h-11 focus:tw-outline-none tw-shrink-0 border-solid tw-border-r tw-border-zinc-400 tw-rounded-l-full tw-z-10',
          isModeFavorites &&
            'tw-bg-blue-500 hover:tw-bg-blue-400 focus-visible:tw-bg-blue-400 tw-text-white',
          !isModeFavorites &&
            'tw-bg-white hover:tw-bg-zinc-100 focus-visible:tw-bg-zinc-100 tw-text-zinc-800',
        ]"
        @click="$emit('toggle-favorites')"
      >
        <FavoriteIcon :is-active="isModeFavorites" />
        <span class="tw-hidden md:tw-inline favoriteTitle">{{
          $t('favorites.title')
        }}</span>
        <Badge
          id="favourites_counter"
          :items="favoritesIds.length"
          class="tw-absolute tw-top-1/2 tw-right-0 -tw-translate-y-1/2 tw-translate-x-1/2"
        />
      </button>
      <button
        id="open_favourites_notebook"
        type="button"
        :class="[
          'tw-relative tw-space-x-1 tw-text-sm tw-font-medium tw-shadow-md tw-outline-none md:tw-px-5 tw-w-11 md:tw-w-auto tw-h-11 focus:tw-outline-none tw-shrink-0 tw-rounded-r-full',
          'tw-bg-white hover:tw-bg-zinc-100 focus-visible:tw-bg-zinc-100 tw-text-zinc-800',
          favoritesIds.length === 0 && 'tw-bg-zinc-100 tw-cursor-not-allowed',
        ]"
        :disabled="favoritesIds.length === 0"
        @click="openNotebookModal"
      >
        <FontAwesomeIcon
          ref="menu_icon"
          icon="book-open"
          class="tw-text-zinc-500 tw-mr-2"
          size="sm"
        />
        <span class="tw-hidden md:tw-inline favoriteTitle">
          {{ $t('favorites.menu_notebook') }}
        </span>
      </button>
    </div>

    <div>
      <v-dialog
        v-model="notebookModal"
        :fullscreen="smallScreen"
        max-width="80rem"
      >
        <FavoriteNoteBook
          :favs="favs"
          :selected-favs-ids="favoritesIds"
          :explorer-mode-enabled="explorerModeEnabled"
          @explore-click="explore"
          @favorite-click="handleFavorite"
          @zoom-click="goTo"
          @on-close="notebookModal = false"
        />
      </v-dialog>
    </div>
  </section>
</template>

<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { mapState } from 'pinia'
import { PropType } from 'vue'
import { VDialog } from 'vuetify/components/VDialog'

import { defineNuxtComponent, useRequestHeaders } from '#app'
import FavoriteNoteBook from '~/components/MainMap/FavoriteNoteBook.vue'
import Badge from '~/components/UI/Badge.vue'
import FavoriteIcon from '~/components/UI/FavoriteIcon.vue'
import { getPois, ApiPoi, ApiPoiId } from '~/lib/apiPois'
import { mapStore } from '~/stores/map'

export default defineNuxtComponent({
  components: {
    FontAwesomeIcon,
    Badge,
    FavoriteNoteBook,
    FavoriteIcon,
    VDialog,
  },
  props: {
    favoritesIds: {
      type: Array as PropType<ApiPoiId[]>,
      default: false,
    },
    exploreAroundSelectedPoi: {
      type: Function,
      required: true,
    },
    goToSelectedPoi: {
      type: Function,
      required: true,
    },
    toggleFavorite: {
      type: Function,
      required: true,
    },
    explorerModeEnabled: {
      type: Boolean,
      required: true,
    },
  },

  emits: {
    'toggle-favorites': () => true,
  },

  data(): {
    isCopied: boolean
    favs: ApiPoi[]
    notebookModal: boolean
  } {
    return {
      isCopied: false,
      favs: [],
      notebookModal: false,
    }
  },

  computed: {
    ...mapState(mapStore, ['isModeFavorites']),
    smallScreen(): boolean {
      return this.$device.value.smallScreen
    },
  },
  methods: {
    async fetchFavorites(ids: number[]) {
      return await getPois(this.$vidoConfig(useRequestHeaders()), ids).then(
        (pois) => (pois && pois.features) || []
      )
    },

    async getFavs() {
      try {
        this.favs = await this.fetchFavorites(this.favoritesIds)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Vido error:', (e as Error).message)
      }
    },
    explore(poi?: ApiPoi) {
      this.notebookModal = false
      this.exploreAroundSelectedPoi(poi)
    },
    goTo(poi?: ApiPoi) {
      this.notebookModal = false
      this.goToSelectedPoi(poi)
    },
    handleFavorite(poi?: ApiPoi) {
      this.toggleFavorite(poi)
    },
    openNotebookModal() {
      this.$tracking({
        type: 'notebook_event',
        event: 'open',
      })

      this.getFavs().then(() => {
        this.notebookModal = true
      })
    },
  },
})
</script>

<style lang="scss" scoped>
.favoriteTitle {
  @media (max-width: 860px) {
    @apply tw-hidden;
  }
}
</style>
