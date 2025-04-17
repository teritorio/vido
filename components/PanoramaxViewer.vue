<script setup lang="ts">
import { Viewer } from '@panoramax/web-viewer'
import '@panoramax/web-viewer/build/index.css'

const props = defineProps<{
  apiEndpoint: string
  photoId: string
}>()

const viewerRef = ref<HTMLDivElement>()
const { locale } = useI18n()

onMounted(() => {
  viewerRef.value = new Viewer(
    viewerRef.value,
    props.apiEndpoint,
    {
      map: false,
      selectedPicture: props.photoId,
      lang: locale.value,
    },
  )
})
</script>

<template>
  <div ref="viewerRef" />
</template>
