<template>
  <div class="px-5 py-4" :class="extraClass">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    extraClass: {
      type: String,
      default: '',
    },
  },
})
</script>
