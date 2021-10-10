<template>
  <section class="relative border-l-2 border-grey bg-white rounded-r-lg">
    <button
      ref="menu"
      class="px-3 h-full focus:outline-none focus-visible:bg-gray-100 hover:bg-gray-100 rounded-r-lg shadow-md"
      @click="openClose"
    >
      <font-awesome-icon
        ref="menu_icon"
        :icon="isOpen ? 'chevron-up' : 'chevron-down'"
        class="text-gray-500"
        size="sm"
      />
    </button>

    <section v-if="isOpen" class="dropdownMenu rounded-md">
      <div class="menuArrow" />
      <button
        class="whitespace-nowrap py-2 px-4 text-sm focus-visible:bg-gray-100 hover:bg-gray-100 w-full"
        @click="shareFavorites"
      >
        <font-awesome-icon
          ref="menu_icon"
          icon="share-alt"
          class="text-gray-500 mr-2"
          size="sm"
        />
        Partager les favoris
      </button>
      <button
        class="whitespace-nowrap py-2 px-4 text-sm focus-visible:bg-gray-100 hover:bg-gray-100 w-full"
        @click="removeFavorites"
      >
        Supprimer les favoris
      </button>
    </section>

    <modal name="shareModal" height="auto" adaptive>
      <div class="p-4 flex flex-col">
        <p class="text-xl mb-4">Partager le lien des favoris</p>
        <p class="text-gray-500 mb-4">
          {{ shareLink }}
        </p>
        <button
          class="self-end focus:outline-none focus-visible:bg-gray-100 hover:bg-gray-100 py-2 px-4 rounded-full"
          @click="copyLink"
        >
          Copier
        </button>
      </div>
    </modal>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'

import { LOCAL_STORAGE } from '@/lib/constants'

export default Vue.extend({
  data(): {
    isOpen: boolean
    shareLink: string
    dialog: boolean
  } {
    return {
      isOpen: false, // Variable if the menu is open or closed
      shareLink: '',
      dialog: false,
    }
  },
  methods: {
    catchOutsideClick(event, dropdown) {
      // When user clicks menu — do nothing
      if (dropdown.includes(event.target)) {
        return false
      }

      // When user clicks outside of the menu — close the menu
      if (this.isOpen && !dropdown.includes(event.target)) {
        return true
      }
    },
    openClose() {
      const _this = this

      const closeListerner = (e) => {
        if (
          _this.catchOutsideClick(e, [_this.$refs.menu, _this.$refs.menu_icon])
        ) {
          window.removeEventListener('click', closeListerner)
          _this.isOpen = false
        }
      }

      window.addEventListener('click', closeListerner)

      this.isOpen = !this.isOpen
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
    shareFavorites() {
      try {
        let favs =
          localStorage.getItem(LOCAL_STORAGE.favorites) || '{ "favorites": [] }'
        favs = JSON.parse(favs).favorites

        this.shareLink = `${
          location.origin
        }/#map=7/44.055/0.056&favs=${favs.join(',')}`

        this.$modal.show('shareModal')
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Vido error:', e.message)
      }
    },
    closeModal() {
      this.$modal.hide('shareModal')
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
<style>
.dropdownMenu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: -8px;
  width: auto;
  background: white;
  padding: 15px 0;
  animation: menu 0.3s ease forwards;
}

.menuArrow {
  width: 20px;
  height: 20px;
  position: absolute;
  top: -10px;
  right: 7px;
  border-left: 1px solid #eee;
  border-top: 1px solid #eee;
  background: white;
  transform: rotate(45deg);
  border-radius: 4px 0 0 0;
}

@keyframes menu {
  from {
    transform: translate3d(0, 30px, 0);
  }
  to {
    transform: translate3d(0, 20px, 0);
  }
}
</style>
