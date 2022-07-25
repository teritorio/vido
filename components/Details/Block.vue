<template>
  <div
    id="block"
    class="relative detail-left-block flex flex-col justify-end"
    :style="`
      background-color: ${colorFill};
    `"
  >
    <font-awesome-icon
      id="block-icon"
      prefix="fa"
      :icon="icon"
      class="absolute z-0"
    />
    <slot id="block-content" class="relative z-10"></slot>
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
    icon: {
      type: String,
      required: true,
    },
  },
})
</script>

<style lang="css" scoped>
#block {
  padding: 2.7rem 1.6rem;
  margin-bottom: 4rem;
  min-height: 13rem;
}

#block-icon {
  opacity: 0.1;
  font-size: 10rem;
  right: 1.6rem;
  top: 1.6rem;
}

#block * {
  color: white;
  text-decoration: none;
}
</style>
