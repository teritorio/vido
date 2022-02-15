<template>
  <div
    :class="[
      'flex items-center justify-center flex-shrink-0 text-white rounded-full border-2 border-white',
      iconDim,
      Boolean(image) && 'shadow-md',
    ]"
    :style="{ backgroundColor: color }"
  >
    <TeritorioIcon
      :category-color="color"
      :class="`text-${iconSize}`"
      :picto="picto"
      :image="image"
    />
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
    image: {
      type: String,
      required: false,
    },
  },

  computed: {
    iconSize(): string {
      const values: { [size: string]: string } = {
        xs: 'xs',
        sm: 'md',
        md: 'lg',
        lg: 'lg',
        xl: 'xl',
      }
      return values[this.size || 'md']
    },
    iconDim(): string {
      const values: { [size: string]: string } = {
        xs: 'w-4 h-4',
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-10 h-10',
        xl: 'w-12 h-12',
      }
      return this.image ? values.xl : values[this.size || 'md']
    },
  },
})
</script>
