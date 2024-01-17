<script lang="ts">
import type { PropType } from 'vue'

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

<template>
  <aside
    class="tw-rounded-xl tw-shadow-md tw-pointer-events-auto" :class="[
      !isFilterActive && 'tw-overflow-y-hidden',
    ]"
  >
    <div class="tw-px-5 tw-py-4" :class="[extraClassTextBackground]">
      <slot />
    </div>
  </aside>
</template>

<style scoped>
aside {
  min-width: 432px;
}
</style>
