<template>
  <i
    v-if="!Boolean(image)"
    :class="[!useNativeAlignment && 'flex items-center justify-center', picto]"
    :style="{ color: textColor }"
  />
  <img v-else-if="Boolean(image)" class="rounded-full" :src="image" />
</template>

<script lang="ts">
import Vue from 'vue'

import { getContrastedTextColor } from '@/utils/picto'

export default Vue.extend({
  props: {
    colorBackground: {
      type: String,
      default: null,
    },
    colorText: {
      type: String,
      default: null,
    },
    picto: {
      type: String,
      required: true,
    },
    useNativeAlignment: {
      type: Boolean,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
  },
  computed: {
    textColor() {
      return this.colorText || getContrastedTextColor(this.colorBackground)
    },
  },
})
</script>
