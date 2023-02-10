<template>
  <section>
    <div class="flex right-10">
      <button
        id="button_favourites_mode"
        ref="menu"
        type="button"
        :aria-label="$tc('favorites.title')"
        :class="[
          'relative space-x-1 text-sm font-medium shadow-md outline-none md:px-5 w-11 md:w-auto h-11 focus:outline-none shrink-0 rounded-l-full',
          isModeFavorites &&
            'bg-blue-500 hover:bg-blue-400 focus-visible:bg-blue-400 text-white',
          !isModeFavorites && 'bg-white',
        ]"
        @click="$emit('toggle-favorites')"
      >
        <FavoriteIcon :is-active="isModeFavorites" />
        <span class="hidden md:inline favoriteTitle">
          {{ $tc('favorites.title') }}
        </span>
        <span
          v-if="favoritesIds.length"
          id="favourites_counter"
          class="flex items-center justify-center text-white text-center rounded-full absolute top-1 right-0 w-5 h-5 border-2 border-white bg-red-600"
        >
          <span class="text-xs">{{ favoritesIds.length }}</span>
        </span>
      </button>
      <button
        id="button_burger_favourites_notebook"
        ref="favlist"
        :disabled="!favoritesIds.length"
        :aria-label="$tc('favorites.list')"
        type="button"
        :class="[
          'flex h-11 items-center justify-center shrink-0 px-3 py-2 bg-white border-l border-zinc-00 rounded-r-full hover:bg-zinc-100 shadow-md focus:outline-none bg-zinc-100',
          !favoritesIds.length && ' cursor-not-allowed',
          !isModeFavorites && 'focus-visible:bg-zinc-100 text-zinc-800',
        ]"
        @click="openNotebookModal"
      >
        <span class="sr-only">{{ $tc('favorites.list') }}</span>
        <font-awesome-icon
          ref="menu_icon"
          icon="bars"
          class="text-zinc-500"
          size="sm"
        />
      </button>
    </div>

    <ShareLinkModal ref="shareModal" :title="$tc('favorites.share_link')" />

    <t-modal-notebook
      ref="notebookModal"
      :hide-close-button="true"
      @before-open="getFavs"
    >
      <FavoriteNoteBook
        :favs="favs"
        :explorer-mode-enabled="explorerModeEnabled"
        :explore-around="exploreAroundSelectedPoi"
        @explore-click="explore"
        @favorite-click="handleFavorite"
        @zoom-click="goToSelectedPoi"
        @on-close="closeNoteBook"
        @on-go-to-selected-poi="goToSelectedPoi"
        @on-set-share-link="setShareLink"
      />
    </t-modal-notebook>
  </section>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import { TDropdown, TModal } from 'vue-tailwind/dist/components'
import { mapGetters } from 'vuex'

import FavoriteNoteBook from '~/components/MainMap/FavoriteNoteBook.vue'
import FavoriteIcon from '~/components/UI/FavoriteIcon.vue'
import ShareLinkModal from '~/components/UI/ShareLinkModal.vue'
import { getPois, ApiPoi } from '~/lib/apiPois'

export default (
  Vue as VueConstructor<
    Vue & {
      $refs: {
        shareModal: InstanceType<typeof ShareLinkModal>
        notebookModal: InstanceType<typeof TModal>
      }
    }
  >
).extend({
  components: {
    ShareLinkModal,
    FavoriteNoteBook,
    FavoriteIcon,
  },
  props: {
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
    ...mapGetters({
      isModeFavorites: 'map/isModeFavorites',
      favoritesIds: 'favorite/favoritesIds',
    }),
  },
  methods: {
    async fetchFavorites(ids: [string]) {
      return await getPois(
        this.$vidoConfig().API_ENDPOINT,
        this.$vidoConfig().API_PROJECT,
        this.$vidoConfig().API_THEME,
        ids
      ).then((pois) => (pois && pois.features) || [])
    },

    setShareLink() {
      try {
        this.$refs.shareModal.open(
          `${location.origin}/#mode=favorites&favs=${this.favoritesIds.join(
            ','
          )}`
        )
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Vido error:', e.message)
      }
    },
    handleFavorite(poi?: ApiPoi, isNotebook?: Boolean) {
      this.toggleFavorite(poi, isNotebook)
    },
    openNotebookModal() {
      this.$tracking({
        type: 'notebook_event',
        event: 'open',
      })

      this.$refs.notebookModal?.show()
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
      this.$emit('close')
      this.$emit('explore-click')
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
