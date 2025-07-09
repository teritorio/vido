<script setup lang="ts">
import '@panoramax/web-viewer/build/index.css'

defineProps<{
  pictureId: string
}>()

onMounted(async () => {
  await import('@panoramax/web-viewer')
})
</script>

<template>
  <pnx-photo-viewer
    endpoint="https://api.panoramax.xyz/api"
    :url-parameters="false"
    :picture="pictureId"
    :widgets="false"
  >
    <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute vue/html-self-closing -->
    <pnx-widget-legend slot="bottom-right" focus="map" />
  </pnx-photo-viewer>
</template>

<style lang="css" scoped>
pnx-photo-viewer {
  width: 100%;
  height: 458px;
  position: relative;
}

pnx-widget-legend {
  position: initial;
}
</style>
