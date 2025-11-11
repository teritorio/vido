<script setup lang="ts">
defineProps<{
  src: string
}>()
</script>

<template>
  <div>
    <NuxtPicture :src="src" />
  </div>
</template>
