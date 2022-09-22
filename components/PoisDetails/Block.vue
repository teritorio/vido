<template>
  <div
    id="block"
    class="relative detail-left-block flex flex-col justify-start z-0"
    :style="`
      background-color: ${colorFill};
    `"
  >
    <div class="relative z-10">
      <slot id="block-content"></slot>
    </div>
    <font-awesome-icon
      id="block-icon"
      prefix="fa"
      :icon="icon"
      class="absolute z-0"
    />
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
  margin-left: -1.6rem;
  margin-right: -1.6rem;
  padding: 2.7rem 1.6rem;
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
}
</style>
