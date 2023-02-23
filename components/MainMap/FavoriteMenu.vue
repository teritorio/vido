<template>
  <section>
    <div class="flex right-10">
      <button
        ref="menu"
        type="button"
        :class="[
          'relative space-x-1 text-sm font-medium shadow-md outline-none md:px-5 w-11 md:w-auto h-11 focus:outline-none shrink-0 border-r border-zinc-400 rounded-l-full z-10',
          isModeFavorites &&
            'bg-blue-500 hover:bg-blue-400 focus-visible:bg-blue-400 text-white',
          !isModeFavorites &&
            'bg-white hover:bg-zinc-100 focus-visible:bg-zinc-100 text-zinc-800',
        ]"
        @click="$emit('toggle-favorites')"
      >
        <FavoriteIcon :is-active="isModeFavorites" />
        <span class="hidden md:inline favoriteTitle">{{
          $tc('favorites.title')
        }}</span>
        <Badge
          :items="favoritesIds.length"
          class="absolute top-0 right-0 sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-1/2"
        />
      </button>
      <button
        id="open_favourites_notebook"
        type="button"
        :class="[
          'relative space-x-1 text-sm font-medium shadow-md outline-none md:px-5 w-11 md:w-auto h-11 focus:outline-none shrink-0 rounded-r-full',
          'bg-white hover:bg-zinc-100 focus-visible:bg-zinc-100 text-zinc-800',
          !hasFavorites && 'bg-zinc-100 cursor-not-allowed',
        ]"
        :disabled="!hasFavorites"
        @click="openNotebookModal"
      >
        <font-awesome-icon
          ref="menu_icon"
          icon="book-open"
          class="text-zinc-500 mr-2"
          size="sm"
        />
        <span class="hidden md:inline favoriteTitle">
          {{ $tc('favorites.menu_notebook') }}
        </span>
      </button>
    </div>

    <t-modal-notebook
      ref="notebookModal"
      :hide-close-button="true"
      @before-open="getFavs"
    >
      <FavoriteNoteBook
        :favs="favs"
        :selected-favs-ids="favoritesIds"
        :explorer-mode-enabled="explorerModeEnabled"
        @explore-click="explore"
        @favorite-click="handleFavorite"
        @zoom-click="goTo"
        @on-close="closeNoteBook"
      />
    </t-modal-notebook>
  </section>
</template>

<script lang="ts">
import { mapState } from 'pinia'
import Vue, { VueConstructor } from 'vue'
import { TModal } from 'vue-tailwind/dist/components'

import FavoriteNoteBook from '~/components/MainMap/FavoriteNoteBook.vue'
import Badge from '~/components/UI/Badge.vue'
import FavoriteIcon from '~/components/UI/FavoriteIcon.vue'
import { getPois, ApiPoi } from '~/lib/apiPois'
import { favoritesStore } from '~/stores/favorite'
import { mapStore } from '~/stores/map'

export default (
  Vue as VueConstructor<
    Vue & {
      $refs: {
        notebookModal: InstanceType<typeof TModal>
      }
    }
  >
).extend({
  components: {
    Badge,
    FavoriteNoteBook,
    FavoriteIcon,
  },
  props: {
    hasFavorites: {
      type: Boolean,
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
  data(): {
    isCopied: boolean
    favs: ApiPoi[]
  } {
    return {
      isCopied: false,
      favs: [],
    }
  },
  computed: {
    ...mapState(mapStore, ['isModeFavorites']),
    ...mapState(favoritesStore, ['favoritesIds']),
  },
  methods: {
    async fetchFavorites(ids: Number[]) {
      return await getPois(
        this.$vidoConfig().API_ENDPOINT,
        this.$vidoConfig().API_PROJECT,
        this.$vidoConfig().API_THEME,
        ids
      ).then((pois) => (pois && pois.features) || [])
    },
    closeNoteBook() {
      ;(this.$refs.notebookModal as Vue & { hide: () => void }).hide()
    },
    async getFavs() {
      try {
        this.favs = await this.fetchFavorites(this.favoritesIds)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Vido error:', e.message)
      }
    },
    explore(poi?: ApiPoi) {
      this.closeNoteBook()
      this.exploreAroundSelectedPoi(poi)
    },
    goTo(poi?: ApiPoi) {
      this.closeNoteBook()
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

      this.$refs.notebookModal?.show()
    },
  },
})
</script>

<style lang="scss" scoped>
.favoriteTitle {
  @media (max-width: 860px) {
    @apply hidden;
  }
}
</style>
