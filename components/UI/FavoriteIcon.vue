<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

withDefaults(defineProps<{
  isActive?: boolean
  colorLine?: string
  colorClass?: string
}>(), {
  isActive: false,
  colorClass: 'text-white',
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
    size="sm"
  />
</template>
