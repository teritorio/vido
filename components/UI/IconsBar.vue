<script setup lang="ts">
</script>

<template>
  <ul v-if="$slots.default">
    <li v-for="(vnode, index) in $slots.default()" :key="index">
      <component :is="vnode" v-if="vnode" />
    </li>
  </ul>
</template>

<style lang="scss" scoped>
@import '~/assets/details';

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

@media (width <= 991px) {
  ul {
    text-align: center;
  }
}
</style>
