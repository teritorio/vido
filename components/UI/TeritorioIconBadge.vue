<template>
  <span
    :class="[
      'block flex items-center justify-center shrink-0 text-white rounded-full border-2 border-white',
      iconDim,
      Boolean(image) && 'shadow-md',
    ]"
    :style="{ backgroundColor: colorFill }"
  >
    <TeritorioIcon :class="`text-${iconSize}`" :picto="picto" :image="image" />
    <slot></slot>
  </span>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import TeritorioIcon from '~/components/UI/TeritorioIcon.vue'

export default defineComponent({
  components: {
    TeritorioIcon,
  },

  props: {
    colorFill: {
      type: String as PropType<string>,
      required: true,
    },
    picto: {
      type: String as PropType<string>,
      required: true,
    },
    size: {
      type: String as PropType<string>,
      default: 'md',
    },
    image: {
      type: String as PropType<string>,
      default: null,
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
        '2xl': '2xl',
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
        '2xl': 'w-14 h-14',
      }
      return this.image ? values.xl : values[this.size || 'md']
    },
  },
})
</script>
