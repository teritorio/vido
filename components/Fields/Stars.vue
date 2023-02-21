<template>
  <div class="stars-data text-amber-500 mb-1">
    <font-awesome-icon
      v-for="index in new Array(stars)"
      :key="index"
      icon="star"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    stars: {
      type: Number,
      required: true,
    },
  },
})
</script>
