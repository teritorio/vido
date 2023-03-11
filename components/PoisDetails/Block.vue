<template>
  <div
    :class="[
      'block-block',
      'relative detail-left-block flex flex-col justify-start z-0',
    ]"
    :style="`
      background-color: ${colorFill};
    `"
  >
    <div class="relative z-10">
      <slot id="block-content"></slot>
    </div>
    <font-awesome-icon
      prefix="fa"
      :icon="icon"
      :class="['block-block-icon', 'absolute z-0']"
    />
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'

import { defineNuxtComponent } from '#app'

export default defineNuxtComponent({
  props: {
    colorFill: {
      type: String as PropType<string>,
      required: true,
    },
    icon: {
      type: String as PropType<string>,
      required: true,
    },
  },
})
</script>

<style lang="css" scoped>
.block-block {
  margin-left: -1.6rem;
  margin-right: -1.6rem;
  padding: 2.7rem 1.6rem;
  min-height: 13rem;
}

.block-block-icon {
  opacity: 0.1;
  font-size: 10rem;
  right: 1.6rem;
  top: 1.6rem;
}

.block-block * {
  color: white;
}
</style>
