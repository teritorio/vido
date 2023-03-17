<template>
  <i
    v-if="!Boolean(image) && picto.startsWith('teritorio')"
    :class="[
      picto,
      !useNativeAlignment && 'tw-flex tw-items-center tw-justify-center',
    ]"
    :style="{ color: colorText }"
  />
  <font-awesome-icon
    v-else-if="!Boolean(image)"
    :icon="picto"
    :color="colorText"
  />
  <img v-else-if="Boolean(image)" class="tw-rounded-full" :src="image" />
</template>

<script lang="ts">
import { PropType } from 'vue'

import { defineNuxtComponent } from '#app'

export default defineNuxtComponent({
  props: {
    colorText: {
      type: String as PropType<string>,
      default: '#ffffff',
    },
    picto: {
      type: String as PropType<string>,
      required: true,
    },
    useNativeAlignment: {
      type: Boolean,
      default: null,
    },
    image: {
      type: String as PropType<string>,
      default: null,
    },
  },
})
</script>
