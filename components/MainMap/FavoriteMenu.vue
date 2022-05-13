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
            'relative space-x-1 text-sm font-medium bg-white shadow-md outline-none sm:px-5 w-11 sm:w-auto h-11 focus:outline-none hover:bg-zinc-100 focus-visible:bg-zinc-100 shrink-0 border-r border-zinc-400 rounded-l-full',
            isModeFavorites &&
              'bg-blue-500 hover:bg-blue-400 focus-visible:bg-blue-400 text-white',
            !isModeFavorites && 'text-zinc-800',
          ]"
          @click="toggleFavoritesMode"
        >
          <font-awesome-icon
            :icon="[`${hasFavorites ? 'fas' : 'far'}`, 'star']"
            :class="[
              isModeFavorites && 'text-white',
              !isModeFavorites && 'text-amber-500',
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
          @click="$refs.notebookModal.show()"
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
        :explore-around-selected-poi="explore"
        :toggle-favorite="handleFavorite"
        :go-to-selected-poi="goTo"
        @on-close="closeNoteBook"
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
import { getPoiByIds, ApiPoi } from '@/lib/apiPois'
import { LOCAL_STORAGE } from '@/lib/constants'

import { Mode } from '~/utils/types'

export default (
  Vue as VueConstructor<
    Vue & {
      $refs: {
        shareModal: InstanceType<typeof ShareLinkModal>
      }
    }
  >
).extend({
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
        localStorage.removeItem(LOCAL_STORAGE.favorites)

        this.$store.dispatch('favorite/toggleFavoritesMode', [])
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
          `${location.origin}/#mode=favorites&favs=${favs.join(',')}`
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
    toggleFavoritesMode() {
      this.$tracking({ type: 'map_control_event', event: 'favorite' })
      if (!this.isModeFavorites) {
        this.$store.dispatch('map/setMode', Mode.FAVORITES)
        this.$store.dispatch('favorite/setFavoritesAction', 'open')
      } else {
        this.$store.dispatch('map/setMode', Mode.BROWSER)
        this.$store.dispatch('favorite/setFavoritesAction', 'close')
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
  },
})
</script>
