<template>
  <aside
    class="hidden md:flex flex-col absolute bottom-0 overflow-y-hidden pointer-events-auto sm:relative inset-auto h-max max-h-full box-border space-y-4 p-2 box-border"
  >
    <div
      :class="[
        'items-center justify-between hidden md:flex rounded-xl shadow-md px-5 py-4',
        isModeExplorerOrFavorites ? 'bg-blue-500 text-white' : 'bg-white',
      ]"
    >
      <h1 v-if="!isModeExplorerOrFavorites">
        <a
          :href="mainUrl"
          rel="noopener noreferrer"
          :aria-label="siteName"
          :title="siteName"
          target="_blank"
        >
          <img :src="logoUrl" class="w-auto h-auto max-w-2xl max-h-16" />
        </a>
      </h1>

      <button
        v-if="!isModeExplorerOrFavorites"
        type="button"
        class="flex-grow relative pointer-events-auto w-full ml-6"
        @click="onSearchClick"
      >
        <div class="relative w-full">
          <input
            ref="search"
            value=""
            class="w-full px-5 py-3 font-medium text-zinc-700 placeholder-zinc-500 bg-zinc-100 border-none rounded-full outline-none appearance-none focus:outline-none focus:ring focus:ring-zinc-300"
            :placeholder="$tc('headerMenu.search')"
            type="text"
            @focus="$tracking({ type: 'search' })"
          />
          <div class="absolute inset-y-0 right-0 px-5 py-3 text-zinc-800">
            <font-awesome-icon icon="search" />
          </div>
        </div>
      </button>

      <div v-else class="flex items-center ml-2">
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
import Vue, { PropType } from 'vue'
import { mapGetters } from 'vuex'

import { MenuItem } from '~/lib/apiMenu'

export default Vue.extend({
  props: {
    showPoi: {
      type: Boolean,
      default: false,
    },
    logoUrl: {
      type: String,
      required: true,
    },
    mainUrl: {
      type: String,
      required: true,
    },
    siteName: {
      type: String,
      required: true,
    },
    categoriesActivesubsCount: {
      type: Object as PropType<{ [id: string]: number }>,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters({
      isModeFavorites: 'map/isModeFavorites',
      isModeExplorerOrFavorites: 'map/isModeExplorerOrFavorites',
      firstLevelMenuItems: 'menu/firstLevelMenuItems',
    }),
  },
  methods: {
    onMenuItemClick(menuItemId: MenuItem['id']) {
      this.$emit('menu-item-click', menuItemId)
    },
    onSearchClick() {
      this.$emit('search-click')
    },
    goToMenuItems() {
      this.$emit('go-to-menu-items')
    },
  },
})
</script>
