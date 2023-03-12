<template>
  <ul v-if="$slots.default">
    <li v-for="(vnode, index) in $slots.default()" :key="index">
      <VNodes v-if="vnode" :vnodes="[vnode]" />
    </li>
  </ul>
</template>

<script lang="ts">
import { defineNuxtComponent } from '#app'

export default defineNuxtComponent({
  components: {
    VNodes: (props, ctx) => props.vnodes,
  },
})
</script>

<style lang="scss" scoped>
@import '~/assets/details.scss';

ul {
  position: relative;
  display: block;
  width: 100%;
  text-align: right;
  margin-bottom: 0.6rem;
  list-style: none;

  li {
    display: inline-block;
    margin: 0.3rem;
    border-radius: 50%;
  }
}

@media (max-width: 991px) {
  ul {
    text-align: center;
  }
}
</style>
