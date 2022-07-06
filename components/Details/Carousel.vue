<template>
  <ul v-if="images">
    <li v-for="(image, i) in images" :key="i">
      <img :src="image" />
    </li>
  </ul>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  props: {
    images: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
@import '~/assets/details.scss';

ul,
li {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

ul {
  margin-bottom: 60px;
}

img {
  width: 100%;
}
</style>
