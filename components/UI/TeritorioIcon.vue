<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

withDefaults(defineProps<{
  colorText?: string
  picto: string
  useNativeAlignment?: boolean
  image?: string
}>(), {
  colorText: '#ffffff',
  useNativeAlignment: false,
})
</script>

<template>
  <i
    v-if="!Boolean(image) && (picto.startsWith('teritorio') || picto.startsWith('glyphicons'))"
    :class="[
      picto,
      !useNativeAlignment && 'tw-flex tw-items-center tw-justify-center',
    ]"
    :style="{ color: colorText }"
  />
  <FontAwesomeIcon
    v-else-if="!Boolean(image)"
    :icon="picto"
    :color="colorText"
  />
  <img v-else-if="Boolean(image)" class="tw-rounded-full" :src="image">
</template>
