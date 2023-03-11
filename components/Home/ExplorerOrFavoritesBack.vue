<template>
  <div class="flex items-center ml-2">
    <button
      type="button"
      class="flex shrink-0 items-center justify-center w-10 h-10 text-2xl font-bold transition-all rounded-full outline-none cursor-pointer focus:outline-none hover:bg-blue-700 focus:bg-blue-700"
      @click="goToMenuItems"
    >
      <font-awesome-icon icon="arrow-left" size="xs" />
    </button>
    <p class="ml-2">
      {{
        $t(
          screen.smallScreen
            ? isModeFavorites
              ? 'headerMenu.backToMenuFavorites'
              : 'headerMenu.backToMenuExplorer'
            : isModeFavorites
            ? 'headerMenu.backToMenuFavoritesMobile'
            : 'headerMenu.backToMenuExplorerMobile'
        )
      }}
    </p>
  </div>
</template>

<script lang="ts">
import { mapState } from 'pinia'

import { defineNuxtComponent, useNuxtApp } from '#app'
import { mapStore } from '~/stores/map'

export default defineNuxtComponent({
  computed: {
    ...mapState(mapStore, ['isModeFavorites']),

    screen() {
      return useNuxtApp().$screen
    },
  },

  methods: {
    goToMenuItems() {
      this.$emit('click')
    },
  },
})
</script>
