<template>
  <div
    class="flex items-center ml-2 hover:cursor-pointer"
    @click="goToMenuItems"
  >
    <button
      type="button"
      :aria-label="$tc(buttonText)"
      class="flex shrink-0 items-center justify-center w-10 h-10 text-2xl font-bold transition-all rounded-full outline-none cursor-pointer focus:outline-none hover:bg-blue-700 focus:bg-blue-700"
    >
      <font-awesome-icon icon="arrow-left" size="xs" />
      <span class="sr-only">{{ $tc(buttonText) }}</span>
    </button>
    <p class="ml-2">
      {{ $tc(buttonText) }}
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapGetters({
      isModeFavorites: 'map/isModeFavorites',
    }),
    buttonText: function () {
      return this.$tc(
        this.$screen.smallScreen
          ? this.isModeFavorites
            ? 'headerMenu.backToMenuFavorites'
            : 'headerMenu.backToMenuExplorer'
          : this.isModeFavorites
          ? 'headerMenu.backToMenuFavoritesMobile'
          : 'headerMenu.backToMenuExplorerMobile'
      )
    },
  },

  methods: {
    goToMenuItems() {
      this.$emit('click')
    },
  },
})
</script>
