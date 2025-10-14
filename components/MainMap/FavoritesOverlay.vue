<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { mapStore as useMapStore } from '~/stores/map'
import { Mode } from '~/utils/types'

const emit = defineEmits<{
  (e: 'discard'): void
}>()

const { t } = useI18n()
const { mode } = storeToRefs(useMapStore())

function onOverlayClick() {
  mode.value = Mode.BROWSER
  emit('discard')
}
</script>

<template>
  <div
    v-touch="onOverlayClick"
    class="tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-bg-black tw-bg-opacity-80 tw-z-20 tw-cursor-pointer"
    @click="onOverlayClick"
  >
    <p class="tw-p-8 tw-max-w-sm tw-text-center tw-text-white">
      {{ t('favorites.noFavs') }}
    </p>
  </div>
</template>
