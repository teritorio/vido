<template>
  <aside
    class="flex flex-col overflow-y-hidden pointer-events-auto inset-auto h-max max-h-full box-border space-y-4 p-2 box-border"
  >
    <div
      :class="[
        'items-center justify-between block rounded-xl shadow-md px-5 py-4',
        extraClassTextBackground,
      ]"
    >
      <slot />
    </div>
  </aside>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    extraClassTextBackground: {
      type: String,
      default: 'bg-white',
    },
  },
})
</script>

<style scoped>
aside {
  min-width: 432px;
}
</style>
