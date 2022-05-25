<template>
  <div
    v-touch="onOverlayClick"
    :click="onOverlayClick"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-20 cursor-pointer"
  >
    <p class="p-8 max-w-sm text-center text-white">
      {{ $tc('favorites.noFavs') }}
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { Mode } from '~/utils/types'

export default Vue.extend({
  methods: {
    onOverlayClick() {
      this.$store.dispatch('map/setMode', Mode.BROWSER)
      this.$emit('discard')
    },
  },
})
</script>
