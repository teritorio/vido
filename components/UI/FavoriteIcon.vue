<template>
  <font-awesome-icon
    :icon="[isActive ? 'fas' : 'far', 'star']"
    :class="[
      !isActive && !colorLine && 'tw-text-amber-500',
      isActive && 'tw-text-amber-500',
    ]"
    :color="!isActive && colorLine"
    size="sm"
  />
</template>

<script lang="ts">
import { PropType } from 'vue'

import { defineNuxtComponent } from '#app'

export default defineNuxtComponent({
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    colorLine: {
      type: String as PropType<string>,
      default: null,
    },
    colorClass: {
      type: String as PropType<string>,
      default: 'text-white',
    },
  },
})
</script>
