<template>
  <div class="stars-data text-amber-500 mb-1">
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
