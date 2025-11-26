<script setup lang="ts">
defineProps<{
  alt: string
  src: string
}>()
</script>

<template>
  <NuxtPicture
    :src="src"
    :alt="alt"
  />
</template>
