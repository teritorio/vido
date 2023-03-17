<template>
  <div class="tw-px-5 tw-py-4" :class="extraClass">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'

import { defineNuxtComponent } from '#app'

export default defineNuxtComponent({
  props: {
    extraClass: {
      type: String as PropType<string>,
      default: '',
    },
  },
})
</script>
