<template>
  <div
    :class="[
      'block-block',
      'tw-relative tw-detail-left-block tw-flex tw-flex-col tw-justify-start tw-z-0',
    ]"
    :style="`
      background-color: ${colorFill};
    `"
  >
    <div class="tw-relative tw-z-10">
      <slot id="block-content"></slot>
    </div>
    <FontAwesomeIcon
      prefix="fa"
      :icon="icon"
      :class="['block-block-icon', 'tw-absolute tw-z-0']"
    />
  </div>
</template>

<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { PropType } from 'vue'

import { defineNuxtComponent } from '#app'

export default defineNuxtComponent({
  components: {
    FontAwesomeIcon,
  },

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
