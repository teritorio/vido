<template>
  <div
    v-touch="onOverlayClick"
    :click="onOverlayClick"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-20 cursor-pointer"
  >
    <p class="p-8 max-w-sm text-center text-white">
      {{ $t('favorites.noFavs') }}
    </p>
  </div>
</template>

<script lang="ts">
import { mapWritableState } from 'pinia'
import { defineComponent } from 'vue'

import { mapStore } from '~/stores/map'
import { Mode } from '~/utils/types'

export default defineComponent({
  computed: {
    ...mapWritableState(mapStore, ['mode']),
  },

  methods: {
    onOverlayClick() {
      this.mode = Mode.BROWSER
      this.$emit('discard')
    },
  },
})
</script>
