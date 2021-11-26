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
          v-on="$listeners"
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
          class="flex h-11 items-center justify-center flex-shrink-0 px-3 py-2 bg-white border-l border-gray-00 rounded-r-full hover:bg-gray-100 shadow-md focus:outline-none"
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
          @click="$refs.shareModal.show()"
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

    <t-modal
      ref="shareModal"
      :header="$tc('favorites.modal.title')"
      :hide-close-button="true"
      @before-open="setShareLink"
    >
      <div class="flex flex-col">
        <div class="flex items-center mb-4">
          <font-awesome-icon
            ref="menu_icon"
            icon="link"
            class="text-gray-500 mr-4"
          />
          <p class="text-gray-500 truncate">
            {{ shareLink }}
          </p>
          <button
            v-if="hasClipboard"
            class="focus:outline-none focus-visible:bg-gray-100 hover:bg-gray-100 py-2 px-4 rounded-full ml-2"
            @click="copyLink"
          >
            <font-awesome-icon
              v-if="isCopied"
              ref="menu_icon"
              icon="clipboard-check"
              class="text-green-500"
            />
            {{ !isCopied ? $tc('favorites.modal.copy') : '' }}
          </button>
        </div>
        <button
          class="self-end focus:outline-none focus-visible:bg-gray-100 hover:bg-gray-100 py-2 px-4 rounded-full"
          @click="$refs.shareModal.hide()"
        >
          {{ $tc('favorites.modal.close') }}
        </button>
      </div>
    </t-modal>

    <t-modal-notebook
      ref="notebookModal"
      :hide-close-button="true"
      @before-open="getFavs"
    >
      <div
        class="flex justify-between items-center py-4 px-1 sm:px-6 sticky top-0 z-50 bg-white"
      >
        <p class="text-lg">{{ $tc('favorites.notebook.title') }}</p>
        <button
          class="flex items-center border-solid border-gray-300 border-2 bg-white focus:outline-none focus-visible:bg-gray-100 hover:bg-gray-100 py-2 px-4 rounded-full"
          @click="$refs.notebookModal.hide()"
        >
          <font-awesome-icon
            ref="menu_icon"
            icon="times"
            class="text-gray-500 sm:mr-2"
            size="sm"
          />
          <p class="hidden sm:block">{{ $tc('favorites.modal.close') }}</p>
        </button>
      </div>
      <div class="flex justify-between flex-wrap max-h-full overflow-y-auto">
        <MapPoiToast
          v-for="item in favs"
          :key="item.id"
          :poi="item"
          class="flex-grow-0 flex-shrink-0 m-2"
          @explore-click="exploreAroundSelectedPoi"
          @favorite-click="toggleFavoriteMode"
          @zoom-click="goToSelectedPoi"
        />
      </div>
    </t-modal-notebook>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { TDropdown } from 'vue-tailwind/dist/components'
import { mapGetters } from 'vuex'

import MapPoiToast from '@/components/MapPoiToast.vue'
import { LOCAL_STORAGE } from '@/lib/constants'
import { getPoiByIds } from '@/utils/api'
import { VidoFeature } from '@/utils/types'

export default Vue.extend({
  components: {
    TDropdown,
    MapPoiToast,
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
    toggleFavoriteMode: {
      type: Function,
    },
  },
  data(): {
    shareLink: string
    hasClipboard: boolean
    isCopied: boolean
    favs: VidoFeature[]
  } {
    return {
      shareLink: '',
      hasClipboard: Boolean(navigator.clipboard),
      isCopied: false,
      favs: [],
    }
  },
  computed: {
    ...mapGetters({
      favoritesIds: 'favorite/favoritesIds',
    }),
    pdfLink(): string {
      return `${
        this.$config.API_ENDPOINT
      }/geodata/v0.1/pois.pdf?ids=${this.favoritesIds.join(',')}`
    },
    csvLink(): string {
      return `${
        this.$config.API_ENDPOINT
      }/geodata/v0.1/pois.csv?ids=${this.favoritesIds.join(',')}`
    },
  },
  methods: {
    async fetchFavorites(ids: [string]) {
      return await getPoiByIds(this.$config.API_ENDPOINT, ids).then(
        (pois) => pois.features
      )
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

        this.shareLink = `${location.origin}/#fav=1&favs=${favs.join(',')}`
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Vido error:', e.message)
        this.shareLink = ''
      }
    },
    copyLink() {
      this.$tracking({ type: 'favorites_event', event: 'copy_link' })
      if (!navigator.clipboard) {
        return
      }
      navigator.clipboard.writeText(this.shareLink).then(
        () => {
          this.isCopied = true
          setTimeout(() => {
            this.isCopied = false
          }, 5000)
        },
        (err) => {
          console.error('Vido error: ', err)
        }
      )
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
        this.shareLink = ''
      }

      this.toggleFavoriteMode('on')
    },
  },
})
</script>
