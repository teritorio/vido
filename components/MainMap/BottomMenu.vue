<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()
</script>

<template>
  <div class="tw-z-0 tw-relative tw-shrink-0 tw-bottom-0 tw-w-full">
    <div
      v-if="isOpen"
      class="tw-relative tw-justify-between tw-w-full tw-bg-white tw-shadow-md tw-pointer-events-auto tw-h-auto"
    >
      <transition name="headers" appear mode="out-in">
        <slot />
      </transition>
    </div>
  </div>
</template>
