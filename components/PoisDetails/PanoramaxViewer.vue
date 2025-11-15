<script setup lang="ts">
import UIPicture from '~/components/UI/UIPicture.vue'

defineProps<{
  imageId: string
  title: string
}>()
</script>

<template>
  <div class="panoramax-viewer">
    <UIPicture
      :src="`https://api.panoramax.xyz/api/pictures/${imageId}/sd.jpg`"
      :alt="title"
    />
    <p>© <a :href="`https://api.panoramax.xyz/?pic=${imageId}`" target="_blank">Panoramax</a></p>
  </div>
</template>

<style lang="css" scoped>
.panoramax-viewer {
  position: relative
}

p {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #FFF;
  padding: .25rem 0.5rem;
  border-radius: .5rem 0 0;
}
</style>
