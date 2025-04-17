<script setup lang="ts">
import PanoramaxViewer from '~/components/PanoramaxViewer'
</script>

<template>
  <div>
    <h1>Panoramax Demo</h1>
    <ClientOnly>
      <PanoramaxViewer
        api-endpoint="https://api.panoramax.xyz/api"
        photo-id="a6bde890-797e-4902-b5c7-7ea62f9e45ee"
      />
    </ClientOnly>
  </div>
</template>
