<template>
  <aside
    :class="[
      'tw-flex tw-flex-col tw-pointer-events-auto tw-inset-auto tw-h-max tw-max-h-full tw-box-border tw-space-y-4 tw-p-2',
      !isFilterActive && 'tw-overflow-y-hidden',
    ]"
  >
    <div
      :class="[
        'tw-items-center tw-justify-between tw-block tw-rounded-xl tw-shadow-md tw-px-5 tw-py-4',
        extraClassTextBackground,
      ]"
    >
      <slot></slot>
    </div>
  </aside>
</template>

<script lang="ts">
import { PropType } from 'vue'

import { defineNuxtComponent } from '#app'

export default defineNuxtComponent({
  props: {
    extraClassTextBackground: {
      type: String as PropType<string>,
      default: 'tw-bg-white',
    },
    isFilterActive: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style scoped>
aside {
  min-width: 432px;
}
</style>
