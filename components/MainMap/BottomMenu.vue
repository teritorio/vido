<template>
  <div class="z-0 relative shrink-0 md:hidden text-center bottom-0 w-full">
    <button
      v-if="showGrip"
      class="-top-12 z-0 absolute md:hidden right-3/8 left-3/8 w-1/4 h-12 transition-all rounded-t-lg text-sm font-medium px-5 space-x-1 shadow-lg outline-none focus:outline-none bg-white text-zinc-800 hover:bg-zinc-100 focus-visible:bg-zinc-100"
      @click="$emit('on-grip-click')"
    >
      <font-awesome-icon icon="grip-lines" size="lg" />
    </button>

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
import Vue from 'vue'

export default Vue.extend({
  props: {
    showGrip: Boolean,
    isOpen: Boolean,
  },
})
</script>
