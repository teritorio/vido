<script lang="ts">
import { storeToRefs } from 'pinia'
import { defineNuxtComponent } from '#app'
import { mapStore as useMapStore } from '~/stores/map'
import { Mode } from '~/utils/types'

export default defineNuxtComponent({
  setup() {
    const { mode } = storeToRefs(useMapStore())

    return {
      mode,
    }
  },

  emits: {
    discard: () => true,
  },

  methods: {
    onOverlayClick() {
      this.mode = Mode.BROWSER
      this.$emit('discard')
    },
  },
})
</script>

<template>
  <div
    v-touch="onOverlayClick"
    class="tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-bg-black tw-bg-opacity-80 tw-z-20 tw-cursor-pointer"
    @click="onOverlayClick"
  >
    <p class="tw-p-8 tw-max-w-sm tw-text-center tw-text-white">
      {{ $t('favorites.noFavs') }}
    </p>
  </div>
</template>
