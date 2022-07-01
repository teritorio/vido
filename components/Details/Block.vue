<template>
  <div
    id="block"
    class="detail-left-block"
    :style="`
      background-color: ${colorFill};
    `"
  >
    <font-awesome-icon id="block-icon" prefix="fa" :icon="icon" />
    <slot id="block-content"></slot>
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
}

#block-icon {
  opacity: 0.1;
  font-size: 10rem;
  position: relative;
}

#block * {
  color: white;
  text-decoration: none;
}
</style>
