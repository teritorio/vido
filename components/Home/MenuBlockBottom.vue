<template>
  <div class="px-5 py-4" :class="extraClass">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    extraClass: {
      type: String as PropType<string>,
      default: '',
    },
  },
})
</script>
