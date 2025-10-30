<script setup lang="ts">
defineProps<{
  attribution?: string
}>()
</script>

<template>
  <div
    v-if="attribution"
    class="tw-text-2xs md:tw-text-xs tw-p-2 tw-text-right tw-bg-white tw-z-10"
    v-html="attribution"
  />
</template>
