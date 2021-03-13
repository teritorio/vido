<template>
  <form @submit.prevent="onSubmit">
    <input
      class="w-full px-5 py-3 font-medium text-gray-700 placeholder-gray-500 bg-gray-200 rounded-full appearance-none focus:bg-gray-100 text-md focus:outline-none focus:ring focus:border-green-300"
      placeholder="Rechercher dans les Landes"
    />
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
