<template>
  <section>
    <div class="stars-data text-amber-500 mb-1">
      <span v-for="index in new Array(stars)" :key="index" class="star-item">
        <font-awesome-icon :icon="'star'" />
      </span>
    </div>
  </section>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    stars: {
      type: Number,
      default: 0,
      required: true,
    },
  },
})
</script>
