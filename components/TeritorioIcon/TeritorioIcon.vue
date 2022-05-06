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
    categoryColor: {
      type: String,
      required: true,
    },
    picto: {
      type: String,
      required: true,
    },
    useCategoryColor: {
      type: Boolean,
      default: null,
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
      if (this.useCategoryColor) {
        return this.categoryColor
      }

      return getContrastedTextColor(this.categoryColor)
    },
  },
})
</script>
