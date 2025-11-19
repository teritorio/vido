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
      sizes="sm:768px"
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
  background-color: #ffffff80;
  padding-left: .25rem;
  font-size: 0.7rem;
}

@media (width >= 768px) {
  p {
    font-size: 0.8rem;
  }
}
</style>
