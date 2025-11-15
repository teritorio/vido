<script setup lang="ts">
defineProps<{
  alt: string
  src: string
}>()
</script>

<template>
  <div>
    <NuxtPicture :src="src" :alt="alt" />
  </div>
</template>
