<template>
  <font-awesome-icon
    :icon="[isActive ? 'fas' : 'far', 'star']"
    :class="[
      !isActive && !colorLine && 'text-amber-500',
      isActive && 'text-amber-500',
    ]"
    :color="!isActive && colorLine"
    size="sm"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
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
