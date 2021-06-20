<template>
  <div
    class="fixed inset-0 z-20 flex items-start justify-end p-4 bg-gray-900 pointer-events-auto bg-opacity-70"
    @click.stop="onCloseClick"
  >
    <div
      v-if="entries.length > 0"
      class="flex flex-col items-end px-5 py-4 bg-white shadow-md rounded-xl"
    >
      <button
        type="button"
        class="flex items-center justify-center w-10 h-10 text-2xl font-bold transition-all rounded-full outline-none cursor-pointer focus:outline-none hover:bg-gray-100 focus:bg-gray-100"
        @click="onCloseClick"
      >
        <font-awesome-icon icon="times" class="text-gray-800" size="xs" />
      </button>

      <a
        v-for="entry in entries"
        :key="entry.post_id"
        class="w-full px-5 py-3 rounded-lg outline-none focus:outline-none hover:bg-gray-100"
        :href="entry.url"
        rel="noopener noreferrer"
        target="_blank"
        @click.stop
      >
        {{ entry.title }}
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { NavMenuEntry } from '@/utils/types'

export default Vue.extend({
  data(): {
    entries: NavMenuEntry[]
  } {
    return {
      entries: [],
    }
  },

  mounted() {
    this.fetchConfig()
  },

  methods: {
    fetchConfig() {
      fetch(`${this.$config.API_ENDPOINT}/geodata/v1/articles?slug=non-classe`)
        .then((data) => data.json())
        .then((data) => (this.entries = data))
    },

    onCloseClick() {
      this.$emit('close-click')
    },
  },
})
</script>
