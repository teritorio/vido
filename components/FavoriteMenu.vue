<template>
  <section>
    <TDropdown
      :text="$tc('favorites.menu_label')"
      :classes="{
        dropdown:
          'origin-top-right absolute right-16 rounded shadow bg-white mt-1',
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
          class="space-x-1 text-sm font-medium text-gray-800 bg-white shadow-md outline-none sm:px-5 w-11 sm:w-auto hh-11 focus:outline-none hover:bg-gray-100 focus-visible:bg-gray-100 flex-shrink-0 border-r border-gray-400 rounded-l-full"
          v-on="$listeners"
        >
          <font-awesome-icon
            :icon="[`${isModeFavorite ? 'fas' : 'far'}`, 'star']"
            class="text-yellow-500"
            size="sm"
          />
          <span class="hidden sm:inline">{{ $tc('favorites.title') }}</span>
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
            icon="share-alt"
            class="text-gray-500 mr-2"
            size="sm"
          />
          {{ $tc('favorites.menu_share') }}
        </button>
        <button
          class="block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
          role="menuitem"
          @blur="blurHandler"
          @click="
            removeFavorites()
            hide()
          "
        >
          {{ $tc('favorites.menu_clear') }}
        </button>
      </div>
    </TDropdown>

    <TModal
      ref="shareModal"
      :header="$tc('favorites.modal.title')"
      :hide-close-button="true"
      @before-open="setShareLink"
    >
      <div class="flex flex-col">
        <p class="text-gray-500 mb-4">
          {{ shareLink }}
        </p>
        <button
          v-if="hasClipboard"
          class="self-end focus:outline-none focus-visible:bg-gray-100 hover:bg-gray-100 py-2 px-4 rounded-full"
          @click="copyLink"
        >
          {{ $tc('favorites.modal.copy') }}
        </button>
      </div>
    </TModal>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { TModal, TDropdown } from 'vue-tailwind/dist/components'

import { LOCAL_STORAGE } from '@/lib/constants'

export default Vue.extend({
  components: {
    TModal,
    TDropdown,
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
  },
  data(): {
    shareLink: string
    hasClipboard: boolean
  } {
    return {
      shareLink: '',
      hasClipboard: Boolean(navigator.clipboard),
    }
  },
  methods: {
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

        this.shareLink = `${location.origin}/#favs=${favs.join(',')}`
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Vido error:', e.message)
        this.shareLink = ''
      }
    },
    copyLink() {
      if (!navigator.clipboard) {
        return
      }
      navigator.clipboard.writeText(this.shareLink).then(
        () => {},
        (err) => {
          console.error('Vido error: ', err)
        }
      )
    },
  },
})
</script>
