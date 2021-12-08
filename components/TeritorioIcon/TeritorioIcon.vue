<template>
  <i
    v-if="!Boolean(image)"
    :class="[
      !useNativeAlignment && 'flex items-center justify-center',
      pictoClassName,
    ]"
    :style="{ color: textColor }"
  />
  <img v-else-if="Boolean(image)" class="rounded-full" :src="image" />
</template>

<script lang="ts">
import Vue from 'vue'

import { getContrastedTextColor, getPictoClassName } from '@/utils/picto'

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
      required: false,
    },
    useNativeAlignment: {
      type: Boolean,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
  },
  computed: {
    pictoClassName() {
      return getPictoClassName(this.picto)
    },
    textColor() {
      if (this.useCategoryColor) {
        return this.categoryColor
      }

      return getContrastedTextColor(this.categoryColor)
    },
  },
})
</script>
