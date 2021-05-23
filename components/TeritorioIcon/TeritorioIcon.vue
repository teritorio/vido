<template>
  <i
    :class="[
      !useNativeAlignment && 'flex items-center justify-center',
      pictoClassName,
    ]"
    :style="{ color: textColor }"
  />
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
