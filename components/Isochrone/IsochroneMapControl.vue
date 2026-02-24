<script setup lang="ts">
import type { Map } from 'maplibre-gl'
import { Control } from '@teritorio/map'
import IsochroneTrigger from '~/components/Isochrone/IsochroneTrigger.vue'
import type { Poi } from '~/types/local/poi'

const props = defineProps<{
  feature: Poi
  map: Map
}>()

const controlRef = ref<InstanceType<typeof HTMLDivElement>>()
class IsochroneControl extends Control {
  constructor(container: HTMLDivElement) {
    super(container)
  }
}

onMounted(() => {
  if (controlRef.value) {
    const control = new IsochroneControl(controlRef.value)
    props.map.addControl(control)
  }
})
</script>

<template>
  <div ref="controlRef" class="maplibregl-ctrl maplibregl-ctrl-group">
    <IsochroneTrigger :feature="feature" />
  </div>
</template>
