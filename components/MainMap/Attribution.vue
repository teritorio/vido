<template>
  <div
    v-if="attributions"
    class="text-2xs p-2 text-right sm:hidden bg-white z-10"
    v-html="attributions"
  ></div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    attributions: {
      type: String,
      default: null,
    },
  },
})
</script>
