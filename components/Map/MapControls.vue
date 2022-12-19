<template>
  <div class="hidden">
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
        // Hack to be style the controler
        geolocateControl._container.classList.add('control-geolocate')

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
#map .mapboxgl-ctrl-group,
#map .maplibre-ctrl-group {
  @apply mt-2 mb-2;

  background: none;
}

#map .mapboxgl-ctrl-group:not(:empty),
#map .maplibregl-ctrl-group:not(:empty) {
  box-shadow: none;
}

#map .mapboxgl-ctrl-group > button,
#map .maplibregl-ctrl-group > button,
#map .mapboxgl-ctrl-group > button:not(:disabled),
#map .maplibregl-ctrl-group > button:not(:disabled) {
  border: none;
  @apply text-sm font-bold text-zinc-800 bg-white rounded-full shadow-md outline-none w-11 h-11;
  @apply focus:rounded-full focus:shadow-md focus:outline-none focus-visible:bg-zinc-100;
  @apply hover:bg-zinc-100;
}

#map .mapboxgl-ctrl-group > button.mapboxgl-ctrl-active,
#map .maplibregl-ctrl-group > button.maplibregl-ctrl-active,
#map .mapboxgl-ctrl-group > button.mapboxgl-ctrlactive:not(:disabled),
#map .maplibregl-ctrl-group > button.maplibregl-ctrl-active:not(:disabled) {
  @apply bg-blue-500 text-white hover:bg-blue-400 focus-visible:bg-blue-400;
}

#map .mapboxgl-ctrl-top-right,
#map .maplibregl-ctrl-top-right {
  @apply flex flex-col justify-center inset-y-3;
}

#map .mapboxgl-ctrl-attrib,
#map .maplibregl-ctrl-attrib {
  font-size: 0.75rem;
  line-height: 1rem;
}

.control-geolocate {
  @apply md:hidden;
}
</style>
