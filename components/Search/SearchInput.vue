<template>
  <form class="flex-grow relative pointer-events-auto w-full">
    <section class="relative w-full">
      <input
        ref="search"
        :value="searchText"
        class="w-full px-5 py-3 font-medium text-zinc-700 placeholder-zinc-500 bg-zinc-100 border-none rounded-full outline-none appearance-none focus:outline-none focus:ring focus:ring-zinc-300"
        :placeholder="$tc('headerMenu.search')"
        type="text"
        @input="$emit('input', $event.target.value)"
        @focus="$tracking({ type: 'search' })"
        @click="$emit('click')"
      />
      <button
        class="absolute inset-y-0 right-0 px-5 text-zinc-800 rounded-r-full outline-none focus:outline-none"
        type="submit"
        @click="focusSearch"
      >
        <font-awesome-icon v-if="!isLoading" icon="search" />
        <font-awesome-icon v-else icon="spinner" class="animate-spin" />
      </button>
    </section>
  </form>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'

export default (
  Vue as VueConstructor<
    Vue & {
      $refs: {
        search: InstanceType<typeof HTMLInputElement> | null
      }
    }
  >
).extend({
  props: {
    searchText: {
      type: String,
      default: '',
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },

  mounted() {
    if (!this.$screen.touch) {
      this.focusSearch()
    }
  },

  methods: {
    focusSearch() {
      this.$refs.search?.focus()
    },
  },
})
</script>
