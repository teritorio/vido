<template>
  <div>
    <slot />
  </div>
</template>

<script lang="ts">
import maplibregl, { Map } from 'maplibre-gl'
import Vue, { PropType } from 'vue'
import 'maplibre-gl/dist/maplibre-gl.css'

export default Vue.extend({
  props: {
    map: {
      type: Object as PropType<Map>,
      default: null,
    },
    showCompass: {
      type: Boolean,
      default: false,
    },
    fullscreenControl: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    map(value, oldValue) {
      if (!oldValue && value) {
        const navigationControl = new maplibregl.NavigationControl({
          showZoom: true,
          showCompass: this.showCompass,
          visualizePitch: true,
        })
        this.map.addControl(navigationControl)

        const geolocateControl = new maplibregl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
        })
        this.map.addControl(geolocateControl)

        if (this.fullscreenControl) {
          const control = new maplibregl.FullscreenControl({})
          this.map.addControl(control)
        }

        const scale = new mapboxgl.ScaleControl({
          maxWidth: 80,
        })
        this.map.addControl(scale)
      }
    },
  },
})
</script>

<style lang="scss">
.mapboxgl-ctrl-group,
.maplibre-ctrl-group {
  @apply mb-4;

  background: none;
}

.mapboxgl-ctrl-group:not(:empty),
.maplibregl-ctrl-group:not(:empty) {
  box-shadow: none;
}

.mapboxgl-ctrl-group > button,
.maplibregl-ctrl-group > button,
.mapboxgl-ctrl-group > button:not(:disabled),
.maplibregl-ctrl-group > button:not(:disabled) {
  @apply text-sm font-bold text-zinc-800 bg-white rounded-full shadow-md outline-none w-11 h-11;
  @apply focus:rounded-full focus:shadow-md focus:outline-none focus-visible:bg-zinc-100;
  @apply hover:bg-zinc-100;
}

.mapboxgl-ctrl-group > button.mapboxgl-ctrl-active,
.maplibregl-ctrl-group > button.maplibregl-ctrl-active,
.mapboxgl-ctrl-group > button.mapboxgl-ctrlactive:not(:disabled),
.maplibregl-ctrl-group > button.maplibregl-ctrl-active:not(:disabled) {
  @apply bg-blue-500 text-white hover:bg-blue-400 focus-visible:bg-blue-400;
}

.mapboxgl-ctrl-top-right,
.maplibregl-ctrl-top-right {
  @apply flex flex-col justify-center inset-y-3;
}

.mapboxgl-ctrl-attrib,
.maplibregl-ctrl-attrib {
  font-size: 0.75rem;
  line-height: 1rem;
}
</style>
