<template>
  <div
    :class="`flex items-center justify-center flex-shrink-0 w-${iconDim} h-${iconDim} text-white rounded-full`"
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
    iconDim(): number {
      const values: { [size: string]: number } = {
        xs: 4,
        sm: 6,
        md: 8,
        lg: 10,
        xl: 12,
      }
      return values[this.size]
    },
  },
})
</script>
