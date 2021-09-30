<template>
  <section class="dropDownMenuWrapper rounded-r-lg">
    <button
      ref="menu"
      class="px-3 h-full focus:outline-none focus-visible:bg-gray-100 hover:bg-gray-100 rounded-r-lg"
      @click="openClose"
    >
      <font-awesome-icon
        :icon="isOpen ? 'chevron-up' : 'chevron-down'"
        class="text-grey-100"
        size="sm"
      />
    </button>

    <section v-if="isOpen" class="dropdownMenu rounded-md">
      <div class="menuArrow" />
      <button
        class="whitespace-nowrap py-2 px-4 text-sm focus-visible:bg-gray-100 hover:bg-gray-100"
        @click="removeFavorites"
      >
        Supprimer les favoris
      </button>
    </section>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'

import { LOCAL_STORAGE } from '@/lib/constants'

export default Vue.extend({
  data() {
    return {
      isOpen: false, // Variable if the menu is open or closed
    }
  },
  methods: {
    catchOutsideClick(event, dropdown) {
      // When user clicks menu — do nothing
      if (dropdown === event.target) {
        return false
      }

      // When user clicks outside of the menu — close the menu
      if (this.isOpen && dropdown !== event.target) {
        return true
      }
    },
    openClose() {
      const _this = this

      const closeListerner = (e) => {
        if (_this.catchOutsideClick(e, _this.$refs.menu)) {
          window.removeEventListener('click', closeListerner)
          _this.isOpen = false
        }
      }

      window.addEventListener('click', closeListerner)

      this.isOpen = !this.isOpen
    },
    removeFavorites() {
      localStorage.removeItem(LOCAL_STORAGE.favorites)

      this.$store.dispatch('favorite/toggleFavoriteModes', { favorites: [] })
    },
  },
})
</script>

<style>
.dropDownMenuWrapper {
  border-left: 1px solid lightgrey;
  position: relative;
  width: 80px;
  background: white;
}

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
