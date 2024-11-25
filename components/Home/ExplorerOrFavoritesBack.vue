<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { storeToRefs } from 'pinia'
import { mapStore as useMapStore } from '~/stores/map'

//
// Emits
//
const emit = defineEmits(['click'])

//
// Props
//
const device = useDevice()
const { t } = useI18n()
const { isModeFavorites } = storeToRefs(useMapStore())

//
// Computed
//
const label = computed(() => {
  if (isModeFavorites.value) {
    return device.value.smallScreen ? 'headerMenu.backToMenuFavoritesMobile' : 'headerMenu.backToMenuFavorites'
  }
  else {
    return device.value.smallScreen ? 'headerMenu.backToMenuExplorerMobile' : 'headerMenu.backToMenuExplorer'
  }
})
</script>

<template>
  <div class="tw-flex tw-items-center tw-ml-2">
    <button
      type="button"
      class="tw-flex tw-shrink-0 tw-items-center tw-justify-center tw-w-10 tw-h-10 tw-text-2xl tw-font-bold tw-transition-all tw-rounded-full tw-outline-none tw-cursor-pointer focus:tw-outline-none hover:tw-bg-blue-700"
      @click="emit('click')"
    >
      <FontAwesomeIcon icon="arrow-left" size="xs" />
    </button>
    <p class="tw-ml-2">
      {{ t(label) }}
    </p>
  </div>
</template>
