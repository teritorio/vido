<script setup lang="ts">
import { Building3d } from '@teritorio/map'
import type { Map } from 'maplibre-gl'

const props = defineProps<{
  map?: Map
}>()

const { $tracking } = useNuxtApp()
const container = ref<InstanceType<typeof HTMLDivElement>>()
const building3d = ref<Building3d>()
const pitched = ref<boolean>(false)

watch(() => props.map, (newValue, oldValue) => {
  if (!oldValue && newValue) {
    building3d.value = new Building3d({
      building3d: pitched.value,
      container: container.value,
    })

    if (props.map) {
      props.map.addControl(building3d.value)
      pitched.value = props.map.getPitch() !== 0

      props.map.on('pitchend', () => {
        pitched.value = props.map!.getPitch() !== 0
      })
    }
  }
})

function toggle3D() {
  $tracking({ type: 'map_control_event', event: '3d' })
  if (building3d.value) {
    if (pitched.value)
      building3d.value.set3d(false, 0)
    else
      building3d.value.set3d(true, 60)
  }
}
</script>

<template>
  <div
    ref="container"
    class="maplibregl-ctrl maplibregl-ctrl-group tw-hidden md:tw-block"
  >
    <button
      id="3D-selector-map"
      :aria-label="$t('mapControls.threeDAriaLabel')"
      type="button"
      :class="pitched && 'maplibregl-ctrl-active'"
      @click="toggle3D"
    >
      3D
    </button>
  </div>
</template>
