<template>
  <header
    class="fixed top-0 bottom-0 flex flex-col w-full h-full max-w-md p-4 pointer-events-none"
  >
    <aside
      class="px-5 py-4 space-y-6 bg-white shadow-md pointer-events-auto rounded-xl"
    >
      <button
        type="button"
        class="flex items-center justify-center w-10 h-10 text-2xl font-bold transition-all rounded-full outline-none cursor-pointer focus:outline-none hover:bg-gray-100 focus:bg-gray-100"
        @click="onGoBackClick"
      >
        <font-awesome-icon icon="arrow-left" class="text-gray-800 fa-xs" />
      </button>

      <form class="flex-none pointer-events-auto" @submit.prevent="onSubmit">
        <section class="relative">
          <input
            class="w-full px-5 py-3 font-medium text-gray-700 placeholder-gray-500 bg-gray-100 border-none rounded-full outline-none appearance-none focus:outline-none focus:ring focus:ring-gray-300"
            placeholder="Recherche"
            type="text"
          />
          <button
            class="absolute inset-y-0 right-0 px-5 text-gray-800 rounded-r-full outline-none focus:outline-none"
            type="submit"
          >
            <font-awesome-icon icon="search" />
          </button>
        </section>
      </form>
    </aside>
  </header>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    onGoBackClick: {
      type: Function,
      required: true,
    },
  },
  methods: {
    onSubmit() {
      // console.log('onSubmit')
    },
  },
})
</script>
