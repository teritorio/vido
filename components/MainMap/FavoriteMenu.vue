<template>
  <section>
    <TDropdown
      :text="$tc('favorites.menu_label')"
      :classes="{
        dropdown:
          'origin-top-right absolute right-14 sm:rigth-16 rounded shadow bg-white mt-1',
      }"
    >
      <div
        slot="trigger"
        slot-scope="{
          mousedownHandler,
          focusHandler,
          blurHandler,
          keydownHandler,
          isShown,
        }"
        class="flex right-10"
      >
        <button
          ref="menu"
          :class="[
            'relative space-x-1 text-sm font-medium bg-white shadow-md outline-none sm:px-5 w-11 sm:w-auto h-11 focus:outline-none hover:bg-gray-100 focus-visible:bg-gray-100 flex-shrink-0 border-r border-gray-400 rounded-l-full',
            isModeFavorite &&
              'bg-blue-500 hover:bg-blue-400 focus-visible:bg-blue-400 text-white',
            !isModeFavorite && 'text-gray-800',
          ]"
          @click="toggleFavoriteMode"
        >
          <font-awesome-icon
            :icon="[`${hasFavorites ? 'fas' : 'far'}`, 'star']"
            :class="[
              isModeFavorite && 'text-white',
              !isModeFavorite && 'text-yellow-500',
            ]"
            size="sm"
          />
          <span class="hidden sm:inline">{{ $tc('favorites.title') }}</span>
          <div
            v-if="hasFavorites"
            class="flex items-center justify-center text-white text-center rounded-full absolute top-0 right-0 w-5 h-5 border-2 border-white bg-red-600"
          >
            <p class="text-xs">{{ favoritesIds.length }}</p>
          </div>
        </button>
        <button
          :class="[
            'flex h-11 items-center justify-center flex-shrink-0 px-3 py-2 bg-white border-l border-gray-00 rounded-r-full hover:bg-gray-100 shadow-md focus:outline-none',
            !hasFavorites && 'bg-gray-100 cursor-not-allowed',
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
            class="text-gray-500"
            size="sm"
          />
        </button>
      </div>

      <div
        slot-scope="{ hide, blurHandler }"
        class="py-1 rounded-md shadow-xs flex flex-col min-w-max"
      >
        <button
          class="block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
          role="menuitem"
          @blur="blurHandler"
          @click="setShareLink()"
        >
          <font-awesome-icon
            ref="menu_icon"
            icon="link"
            class="text-gray-500 mr-2"
            size="sm"
          />
          {{ $tc('favorites.menu_share') }}
        </button>
        <button
          v-if="$config.NOTEBOOK_ENABLED"
          class="block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
          role="menuitem"
          @blur="blurHandler"
          @click="$refs.notebookModal.show()"
        >
          <font-awesome-icon
            ref="menu_icon"
            icon="book-open"
            class="text-gray-500 mr-2"
            size="sm"
          />
          {{ $tc('favorites.menu_notebook') }}
        </button>
        <a
          :href="pdfLink"
          target="_blank"
          class="block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
          role="menuitem"
          @blur="blurHandler"
        >
          <font-awesome-icon
            ref="menu_icon"
            icon="file-download"
            class="text-gray-500 mr-2"
            size="sm"
          />
          {{ $tc('favorites.export_pdf') }}
        </a>
        <a
          :href="csvLink"
          target="_blank"
          class="block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
          role="menuitem"
          @blur="blurHandler"
        >
          <font-awesome-icon
            ref="menu_icon"
            icon="file-download"
            class="text-gray-500 mr-2"
            size="sm"
          />
          {{ $tc('favorites.export_csv') }}
        </a>
        <button
          class="block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
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
            class="text-gray-500 mr-2"
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
        :on-close="closeNoteBook"
        :explore-around-selected-poi="explore"
        :toggle-favorite="handleFavorite"
        :go-to-selected-poi="goTo"
      />
    </t-modal-notebook>
  </section>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import { TDropdown } from 'vue-tailwind/dist/components'
import { mapGetters } from 'vuex'

import FavoriteNoteBook from '@/components/MainMap/FavoriteNoteBook.vue'
import ShareLinkModal from '@/components/ShareLinkModal.vue'
import { getPoiByIds, VidoFeature } from '@/lib/apiPois'
import { LOCAL_STORAGE } from '@/lib/constants'
import { getHashPart, setHashPart } from '@/utils/url'

export default (Vue as VueConstructor<
  Vue & {
    $refs: {
      shareModal: InstanceType<typeof ShareLinkModal>
    }
  }
>).extend({
  components: {
    TDropdown,
    ShareLinkModal,
    FavoriteNoteBook,
  },
  props: {
    hasFavorites: {
      type: Boolean,
      default: false,
    },
    isModeFavorite: {
      type: Boolean,
      default: false,
    },
    exploreAroundSelectedPoi: {
      type: Function,
      default: undefined,
    },
    goToSelectedPoi: {
      type: Function,
      default: undefined,
    },
    toggleFavorite: {
      type: Function,
      default: undefined,
    },
  },
  data(): {
    isCopied: boolean
    favs: VidoFeature[]
  } {
    return {
      isCopied: false,
      favs: [],
    }
  },
  computed: {
    ...mapGetters({
      favoritesIds: 'favorite/favoritesIds',
    }),
    pdfLink(): string {
      return `${this.$config.API_ENDPOINT}/${this.$config.API_PROJECT}/${
        this.$config.API_THEME
      }/pois.pdf?ids=${this.favoritesIds.join(',')}`
    },
    csvLink(): string {
      return `${this.$config.API_ENDPOINT}/${this.$config.API_PROJECT}/${
        this.$config.API_THEME
      }/pois.csv?ids=${this.favoritesIds.join(',')}`
    },
  },
  methods: {
    async fetchFavorites(ids: [string]) {
      return await getPoiByIds(
        this.$config.API_ENDPOINT,
        this.$config.API_PROJECT,
        this.$config.API_THEME,
        ids
      ).then((pois) => (pois && pois.features) || [])
    },
    removeFavorites() {
      try {
        localStorage.removeItem(LOCAL_STORAGE.favorites)

        this.$store.dispatch('favorite/toggleFavoriteModes', [])
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Vido error:', e.message)
      }
    },
    setShareLink() {
      try {
        const favsString =
          localStorage.getItem(LOCAL_STORAGE.favorites) || '{ "favorites": [] }'
        const favs = JSON.parse(favsString).favorites

        this.$refs.shareModal.open(
          `${location.origin}/#fav=1&favs=${favs.join(',')}`
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
        const favsString =
          localStorage.getItem(LOCAL_STORAGE.favorites) || '{ "favorites": [] }'
        const favs = JSON.parse(favsString).favorites

        this.favs = await this.fetchFavorites(favs)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Vido error:', e.message)
      }
    },
    toggleFavoriteMode() {
      this.$tracking({ type: 'map_control_event', event: 'favorite' })
      const isFav = getHashPart('fav') === '1'
      if (!isFav) {
        setHashPart('fav', '1')
        this.$store.dispatch('favorite/handleFavoriteLayer', true)
        this.$store.dispatch('favorite/setFavoritesAction', 'open')
      } else {
        setHashPart('fav', null)
        this.$store.dispatch('favorite/handleFavoriteLayer', false)
        this.$store.dispatch('favorite/setFavoritesAction', 'close')
      }
    },
    explore(poi?: VidoFeature) {
      this.closeNoteBook()
      this.exploreAroundSelectedPoi(poi)
    },
    goTo(poi?: VidoFeature) {
      this.closeNoteBook()
      this.goToSelectedPoi(poi)
    },
    handleFavorite(poi?: VidoFeature, isNotebook?: Boolean) {
      this.toggleFavorite(poi, isNotebook)
    },
  },
})
</script>
