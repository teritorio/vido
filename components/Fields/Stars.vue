<template>
  <div class="stars-data tw-text-amber-500 tw-mb-1">
    <FontAwesomeIcon
      v-for="index in new Array(stars)"
      :key="index"
      icon="star"
    />
  </div>
</template>

<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { defineNuxtComponent } from '#app'

export default defineNuxtComponent({
  components: {
    FontAwesomeIcon,
  },

  props: {
    stars: {
      type: Number,
      required: true,
    },
  },
})
</script>
