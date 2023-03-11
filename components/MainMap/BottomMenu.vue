<template>
  <div class="z-0 relative shrink-0 bottom-0 w-full">
    <div
      v-if="isOpen"
      class="relative justify-between w-full bg-white shadow-md pointer-events-auto h-auto"
    >
      <transition name="headers" appear mode="out-in">
        <slot></slot>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { defineNuxtComponent } from '#app'

export default defineNuxtComponent({
  props: {
    isOpen: Boolean,
  },
})
</script>
