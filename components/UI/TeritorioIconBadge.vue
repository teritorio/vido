<template>
  <span
    :class="[
      'tw-block tw-flex tw-items-center tw-justify-center tw-shrink-0 tw-text-white tw-rounded-full tw-border-2 tw-border-white',
      iconDim,
      Boolean(image) && 'tw-shadow-md',
    ]"
    :style="{ backgroundColor: colorFill }"
  >
    <TeritorioIcon
      :class="`tw-text-${iconSize}`"
      :picto="picto"
      :image="image"
    />
    <slot></slot>
  </span>
</template>

<script lang="ts">
import { PropType } from 'vue'

import { defineNuxtComponent } from '#app'
import TeritorioIcon from '~/components/UI/TeritorioIcon.vue'

export default defineNuxtComponent({
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
        xs: 'tw-w-4 tw-h-4',
        sm: 'tw-w-6 tw-h-6',
        md: 'tw-w-8 tw-h-8',
        lg: 'tw-w-10 tw-h-10',
        xl: 'tw-w-12 tw-h-12',
        '2xl': 'tw-w-14 tw-h-14',
      }
      return this.image ? values.xl : values[this.size || 'md']
    },
  },
})
</script>
