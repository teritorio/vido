<template>
  <div
    id="block"
    class="detail-left-block"
    :style="`
      background-color: ${colorFill};
      background-image: ${imageUrl};
    `"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    colorFill: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/details.scss';

#block {
  padding: 2.7rem 1.6rem;
  margin-bottom: 4rem;
  background-size: 14rem auto;
  background-repeat: no-repeat;
  background-position: 90% 50%;

  * {
    color: white;
    text-decoration: none;
  }

  .contact-item {
    font-size: 1rem;
    margin-bottom: 0.27rem;
  }
}
</style>
