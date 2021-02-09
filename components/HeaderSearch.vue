<template>
  <div class="flex flex-row items-stretch">
    <h1 class="flex px-5 py-3">
      <Logo class="w-20 h-auto" />
    </h1>

    <form class="flex flex-1 overflow-hidden rounded-r-lg">
      <input
        class="flex w-full h-full px-5 font-medium text-gray-500 placeholder-gray-600 bg-gray-100 appearance-none hover:bg-white focus:bg-white text-md"
        placeholder="Rechercher dans les Landes"
      />
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import Logo from '@/components/Logo.vue'

export default Vue.extend({
  components: {
    Logo,
  },
})
</script>
