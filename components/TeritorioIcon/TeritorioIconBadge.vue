<template>
  <div
    :class="[
      'flex items-center justify-center flex-shrink-0 text-white rounded-full border-2 border-white',
      iconDim,
    ]"
    :style="{ backgroundColor: color }"
  >
    <TeritorioIcon :category-color="color" :class="iconSize" :picto="picto" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import TeritorioIcon from '@/components/TeritorioIcon/TeritorioIcon.vue'

export default Vue.extend({
  components: {
    TeritorioIcon,
  },

  props: {
    color: {
      type: String,
      required: true,
    },
    picto: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: 'md',
    },
  },

  computed: {
    iconSize(): string {
      const values: { [size: string]: string } = {
        xs: 'md',
        sm: 'md',
        md: 'lg',
        lg: 'lg',
        xl: 'xl',
      }
      return values[this.size]
    },
    iconDim(): string {
      const values: { [size: string]: string } = {
        xs: 'w-4 h-4',
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-10 h-10',
        xl: 'w-12 h-12',
      }
      return values[this.size]
    },
  },
})
</script>
