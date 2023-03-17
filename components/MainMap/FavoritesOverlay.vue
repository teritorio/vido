<template>
  <div
    v-touch="onOverlayClick"
    :click="onOverlayClick"
    class="tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-bg-black tw-bg-opacity-80 tw-z-20 tw-cursor-pointer"
  >
    <p class="tw-p-8 tw-max-w-sm tw-text-center tw-text-white">
      {{ $t('favorites.noFavs') }}
    </p>
  </div>
</template>

<script lang="ts">
import { mapWritableState } from 'pinia'

import { defineNuxtComponent } from '#app'
import { mapStore } from '~/stores/map'
import { Mode } from '~/utils/types'

export default defineNuxtComponent({
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
