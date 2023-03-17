<template>
  <div class="tw-flex tw-items-center tw-ml-2">
    <button
      type="button"
      class="tw-flex tw-shrink-0 tw-items-center tw-justify-center tw-w-10 tw-h-10 tw-text-2xl tw-font-bold tw-transition-all tw-rounded-full tw-outline-none tw-cursor-pointer focus:tw-outline-none hover:tw-bg-blue-700 focus:tw-bg-blue-700"
      @click="goToMenuItems"
    >
      <font-awesome-icon icon="arrow-left" size="xs" />
    </button>
    <p class="tw-ml-2">
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
