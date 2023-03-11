<template>
  <aside
    :class="[
      'flex flex-col  pointer-events-auto inset-auto h-max max-h-full box-border space-y-4 p-2',
      !isFilterActive && 'overflow-y-hidden',
    ]"
  >
    <div
      :class="[
        'items-center justify-between block rounded-xl shadow-md px-5 py-4',
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
      default: 'bg-white',
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
