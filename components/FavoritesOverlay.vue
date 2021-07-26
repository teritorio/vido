<template>
  <div
    v-touch="onOverlayClick"
    :click="onOverlayClick"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-20 cursor-pointer"
  >
    <p class="p-8 max-w-sm text-center text-white">
      Vous n'avez pas encore de lieux en favoris. Vous pouvez le faire en
      sélectionnant un lieu sur la carte, puis en le mémorisant comme favori.
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { setHashPart } from '@/utils/url'

export default Vue.extend({
  methods: {
    onOverlayClick() {
      setHashPart('fav', null)
      this.$store.dispatch('favorite/handleFavoriteLayer', false)
      this.$store.dispatch('favorite/setFavoritesAction', 'close')
    },
  },
})
</script>
