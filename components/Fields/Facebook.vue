<template>
  <a v-if="url" :href="url" target="_blank">
    <font-awesome-icon icon="fa-brands fa-facebook" size="lg" />
  </a>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    url: {
      type: String as PropType<string>,
      default: null,
    },
  },
})
</script>
