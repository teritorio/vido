<template>
  <form @submit.prevent="onSubmit">
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
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  methods: {
    onSubmit() {
      // console.log('onSubmit')
    },
  },
})
</script>
