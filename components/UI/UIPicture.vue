<script setup lang="ts">
defineProps<{
  alt: string
  src: string
  sizes: string
}>()
</script>

<template>
  <NuxtPicture
    :src="src"
    :alt="alt"
    :sizes="sizes"
  />
</template>
