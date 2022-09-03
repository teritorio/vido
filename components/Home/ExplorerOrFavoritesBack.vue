<template>
  <aside
    class="hidden md:flex flex-col absolute bottom-0 overflow-y-hidden pointer-events-auto sm:relative inset-auto h-max max-h-full box-border space-y-4 p-2 box-border"
  >
    <div
      class="items-center justify-between hidden md:flex rounded-xl shadow-md px-5 py-4 bg-blue-500 text-white"
    >
      <div class="flex items-center ml-2">
        <button
          type="button"
          class="flex shrink-0 items-center justify-center w-10 h-10 text-2xl font-bold transition-all rounded-full outline-none cursor-pointer focus:outline-none hover:bg-blue-700 focus:bg-blue-700"
          @click="goToMenuItems"
        >
          <font-awesome-icon icon="arrow-left" class="text-white" size="xs" />
        </button>
        <p class="ml-2">
          {{
            $tc(
              isModeFavorites
                ? 'headerMenu.backToMenuFavorites'
                : 'headerMenu.backToMenuExplorer'
            )
          }}
        </p>
      </div>
    </div>
  </aside>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapGetters({
      isModeFavorites: 'map/isModeFavorites',
    }),
  },

  methods: {
    goToMenuItems() {
      this.$emit('click')
    },
  },
})
</script>
