<script setup lang="ts">
import TeritorioIcon from '~/components/UI/TeritorioIcon.vue'

const props = withDefaults(defineProps<{
  colorFill: string
  colorText: string
  picto?: string
  size?: string
  image?: string
  text?: string
}>(), {
  size: 'md',
})

const iconSize = computed((): string => {
  const values: { [size: string]: string } = {
    'xs': 'xs',
    'sm': 'md',
    'md': 'sm',
    'lg': 'lg',
    'xl': 'xl',
    '2xl': '2xl',
  }
  return values[props.size || 'md']
})

const iconDim = computed((): string => {
  const values: { [size: string]: string } = {
    'xs': 'tw-w-4 tw-h-4',
    'sm': 'tw-w-6 tw-h-6',
    'md': 'tw-w-8 tw-h-8',
    'lg': 'tw-w-10 tw-h-10',
    'xl': 'tw-w-12 tw-h-12',
    '2xl': 'tw-w-14 tw-h-14',
  }
  return props.image ? values.xl : values[props.size || 'md']
})
</script>

<template>
  <span
    class="tw-block tw-flex tw-items-center tw-justify-center tw-shrink-0 tw-text-white tw-rounded-full tw-border-2"
    :class="[
      iconDim,
      Boolean(image) && 'tw-shadow-md',
    ]"
    :style="{
      backgroundColor: colorFill,
      borderColor: colorText,
      gap: '1px',
    }"
  >
    <b
      v-if="text"
      :style="{ color: colorText }"
    >
      {{ text }}
    </b>
    <TeritorioIcon
      v-if="picto"
      :class="`tw-text-${iconSize}`"
      :picto="picto"
      :image="image"
      :color-text="colorText"
    />

    <slot />
  </span>
</template>
