<script setup lang="ts">
import { FontAwesomeIcon, type FontAwesomeIconProps } from '@fortawesome/vue-fontawesome'

withDefaults(defineProps<{
  isActive?: boolean
  colorLine?: string
  colorClass?: string
  size?: FontAwesomeIconProps['size']
}>(), {
  isActive: false,
  colorClass: 'text-white',
  size: 'lg',
})
</script>

<template>
  <FontAwesomeIcon
    :icon="[isActive ? 'fas' : 'far', 'star']"
    :class="[
      !isActive && !colorLine && 'tw-text-amber-500',
      isActive && 'tw-text-amber-500',
    ]"
    :color="!isActive && colorLine"
    :size="size"
  />
</template>
