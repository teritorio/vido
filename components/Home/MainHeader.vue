<template>
  <aside
    class="hidden md:flex flex-col absolute bottom-0 overflow-y-hidden pointer-events-auto sm:relative inset-auto h-max max-h-full box-border space-y-4 p-2 box-border"
  >
    <div
      class="items-center justify-between hidden md:flex rounded-xl shadow-md px-5 py-4 bg-white"
    >
      <a
        :href="mainUrl"
        rel="noopener noreferrer"
        :aria-label="siteName"
        :title="siteName"
        target="_blank"
      >
        <img :src="logoUrl" class="w-auto h-auto max-w-2xl max-h-16" />
      </a>

      <button
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
    </div>
  </aside>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
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
  },

  methods: {
    onSearchClick() {
      this.$emit('search-click')
    },
  },
})
</script>
