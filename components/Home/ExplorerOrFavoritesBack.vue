<template>
  <div class="tw-flex tw-items-center tw-ml-2">
    <button
      type="button"
      class="tw-flex tw-shrink-0 tw-items-center tw-justify-center tw-w-10 tw-h-10 tw-text-2xl tw-font-bold tw-transition-all tw-rounded-full tw-outline-none tw-cursor-pointer focus:tw-outline-none hover:tw-bg-blue-700"
      @click="goToMenuItems"
    >
      <FontAwesomeIcon icon="arrow-left" size="xs" />
    </button>
    <p class="tw-ml-2">
      {{
        $t(
          device.value.smallScreen
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { mapState } from 'pinia'

import { defineNuxtComponent } from '#app'
import { mapStore } from '~/stores/map'

export default defineNuxtComponent({
  components: {
    FontAwesomeIcon,
  },

  computed: {
    ...mapState(mapStore, ['isModeFavorites']),

    device() {
      return this.$device
    },
  },

  emits: {
    click: () => true,
  },

  methods: {
    goToMenuItems() {
      this.$emit('click')
    },
  },
})
</script>
