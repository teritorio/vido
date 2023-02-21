<template>
  <div>
    <ul>
      <li v-for="(vnode, index) in $slots.default" :key="index">
        <VNodes v-if="vnode.tag" :vnodes="[vnode]" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, RenderContext } from 'vue'

export default defineComponent({
  components: {
    VNodes: {
      functional: true,
      render: (h: any, ctx: RenderContext) => ctx.props.vnodes,
    },
  },

  mounted() {
    // this.$slots.
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
