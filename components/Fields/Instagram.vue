<template>
  <a v-if="url" :href="url" target="_blank">
    <font-awesome-icon icon="fa-brands fa-instagram" size="lg" />
  </a>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  props: {
    url: {
      type: String as PropType<string>,
      default: null,
    },
  },
})
</script>
