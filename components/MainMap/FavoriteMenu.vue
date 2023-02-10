<template>
  <section>
    <TDropdown
      :text="$tc('favorites.menu_label')"
      :classes="{
        dropdown:
          'origin-top-right absolute right-14 md:rigth-16 rounded shadow bg-white mt-1',
      }"
    >
      <template
        #trigger="{
          mousedownHandler,
          focusHandler,
          blurHandler,
          keydownHandler,
        }"
      >
        <div class="flex right-10">
          <button
            ref="menu"
            type="button"
            :class="[
              'relative space-x-1 text-sm font-medium shadow-md outline-none md:px-5 w-11 md:w-auto h-11 focus:outline-none shrink-0 border-r border-zinc-400 rounded-l-full',
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
            <div
              v-if="hasFavorites"
              class="flex items-center justify-center text-white text-center rounded-full absolute top-0 right-0 w-5 h-5 border-2 border-white bg-red-600"
            >
              <p class="text-xs">{{ favoritesIds.length }}</p>
            </div>
          </button>
          <button
            type="button"
            :class="[
              'relative space-x-1 text-sm font-medium shadow-md outline-none md:px-5 w-11 md:w-auto h-11 focus:outline-none shrink-0 rounded-r-full',
              'bg-white hover:bg-zinc-100 focus-visible:bg-zinc-100 text-zinc-800',
              !hasFavorites && 'bg-zinc-100 cursor-not-allowed',
            ]"
            :disabled="!hasFavorites"
            @mousedown="mousedownHandler"
            @focus="focusHandler"
            @blur="blurHandler"
            @keydown="keydownHandler"
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
      </template>
    </TDropdown>

    <t-modal-notebook
      ref="notebookModal"
      :hide-close-button="true"
      @before-open="getFavs"
    >
      <FavoriteNoteBook
        :favs="favs"
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
import Vue, { VueConstructor } from 'vue'
import { TDropdown, TModal } from 'vue-tailwind/dist/components'
import { mapGetters } from 'vuex'

import FavoriteNoteBook from '~/components/MainMap/FavoriteNoteBook.vue'
import FavoriteIcon from '~/components/UI/FavoriteIcon.vue'
import { getPois, ApiPoi } from '~/lib/apiPois'

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
    TDropdown,
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
