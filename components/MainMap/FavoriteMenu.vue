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
          isShown,
        }"
      >
        <div class="flex right-10">
          <button
            ref="menu"
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
            :class="[
              'flex h-11 items-center justify-center shrink-0 px-3 py-2 bg-white border-l border-zinc-00 rounded-r-full hover:bg-zinc-100 shadow-md focus:outline-none',
              !hasFavorites && 'bg-zinc-100 cursor-not-allowed',
            ]"
            :disabled="!hasFavorites"
            @mousedown="mousedownHandler"
            @focus="focusHandler"
            @blur="blurHandler"
            @keydown="keydownHandler"
          >
            <font-awesome-icon
              ref="menu_icon"
              :icon="isShown ? 'chevron-up' : 'chevron-down'"
              class="text-zinc-500"
              size="sm"
            />
          </button>
        </div>
      </template>

      <div
        slot-scope="{ hide, blurHandler }"
        class="py-1 rounded-md shadow-xs flex flex-col min-w-max"
      >
        <button
          class="block w-full px-4 py-2 text-sm leading-5 text-left text-zinc-700 transition duration-150 ease-in-out hover:bg-zinc-100 focus:outline-none focus:bg-zinc-100"
          role="menuitem"
          @blur="blurHandler"
          @click="setShareLink()"
        >
          <font-awesome-icon
            ref="menu_icon"
            icon="share-alt"
            class="text-zinc-500 mr-2"
            size="sm"
          />
          {{ $tc('favorites.menu_share') }}
        </button>
        <button
          class="block w-full px-4 py-2 text-sm leading-5 text-left text-zinc-700 transition duration-150 ease-in-out hover:bg-zinc-100 focus:outline-none focus:bg-zinc-100"
          role="menuitem"
          @blur="blurHandler"
          @click="openNotebookModal"
        >
          <font-awesome-icon
            ref="menu_icon"
            icon="book-open"
            class="text-zinc-500 mr-2"
            size="sm"
          />
          {{ $tc('favorites.menu_notebook') }}
        </button>
        <a
          :href="pdfLink"
          target="_blank"
          class="block w-full px-4 py-2 text-sm leading-5 text-left text-zinc-700 transition duration-150 ease-in-out hover:bg-zinc-100 focus:outline-none focus:bg-zinc-100"
          role="menuitem"
          @blur="blurHandler"
          @click="exportLink('export_pdf')"
        >
          <font-awesome-icon
            ref="menu_icon"
            icon="file-download"
            class="text-zinc-500 mr-2"
            size="sm"
          />
          {{ $tc('favorites.export_pdf') }}
        </a>
        <a
          :href="csvLink"
          target="_blank"
          class="block w-full px-4 py-2 text-sm leading-5 text-left text-zinc-700 transition duration-150 ease-in-out hover:bg-zinc-100 focus:outline-none focus:bg-zinc-100"
          role="menuitem"
          @blur="blurHandler"
          @click="exportLink('export_csv')"
        >
          <font-awesome-icon
            ref="menu_icon"
            icon="file-download"
            class="text-zinc-500 mr-2"
            size="sm"
          />
          {{ $tc('favorites.export_csv') }}
        </a>
        <button
          class="block w-full px-4 py-2 text-sm leading-5 text-left text-zinc-700 transition duration-150 ease-in-out hover:bg-zinc-100 focus:outline-none focus:bg-zinc-100"
          role="menuitem"
          @blur="blurHandler"
          @click="
            removeFavorites()
            hide()
          "
        >
          <font-awesome-icon
            ref="menu_icon"
            icon="trash"
            class="text-zinc-500 mr-2"
            size="sm"
          />
          {{ $tc('favorites.menu_clear') }}
        </button>
      </div>
    </TDropdown>

    <ShareLinkModal ref="shareModal" :title="$tc('favorites.share_link')" />

    <t-modal-notebook
      ref="notebookModal"
      :hide-close-button="true"
      @before-open="getFavs"
    >
      <FavoriteNoteBook
        :favs="favs"
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
import ShareLinkModal from '~/components/ShareLinkModal.vue'
import FavoriteIcon from '~/components/UI/FavoriteIcon.vue'
import { getPoiByIds, ApiPoi } from '~/lib/apiPois'

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
    TDropdown,
    ShareLinkModal,
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
    pdfLink(): string {
      return `${this.$vidoConfig.API_EXPORT}/${this.$vidoConfig.API_PROJECT}/${
        this.$vidoConfig.API_THEME
      }/pois/favorites.pdf?ids=${this.favoritesIds.join(',')}`
    },
    csvLink(): string {
      return `${this.$vidoConfig.API_ENDPOINT}/${
        this.$vidoConfig.API_PROJECT
      }/${this.$vidoConfig.API_THEME}/pois.csv?ids=${this.favoritesIds.join(
        ','
      )}`
    },
  },
  methods: {
    async fetchFavorites(ids: [string]) {
      return await getPoiByIds(
        this.$vidoConfig.API_ENDPOINT,
        this.$vidoConfig.API_PROJECT,
        this.$vidoConfig.API_THEME,
        ids
      ).then((pois) => (pois && pois.features) || [])
    },
    removeFavorites() {
      try {
        this.$store.dispatch('favorite/setFavorites', [])
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Vido error:', e.message)
      }
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
    exportLink(w: 'export_pdf' | 'export_csv') {
      this.$tracking({
        type: 'favorites_event',
        event: w,
      })
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
