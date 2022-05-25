<template>
  <aside class="pointer-events-none">
    <div class="absolute flex flex-col justify-center inset-y-3 right-3">
      <div class="flex flex-col space-y-3 pointer-events-auto">
        <div ref="navigationControlContainer"></div>
        <div ref="geolocateControlContainer" class="md:hidden"></div>
        <slot v-if="map"></slot>
      </div>
    </div>
  </aside>
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
  },

  watch: {
    map(value, oldValue) {
      if (!oldValue && value) {
        const navigationControl = new maplibregl.NavigationControl({
          showZoom: true,
          showCompass: this.showCompass,
          visualizePitch: true,
        })

        ;(this.$refs.navigationControlContainer as HTMLDivElement).appendChild(
          navigationControl.onAdd(this.map)
        )

        const geolocateControl = new maplibregl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
        })

        ;(this.$refs.geolocateControlContainer as HTMLDivElement).appendChild(
          geolocateControl.onAdd(this.map)
        )

        const scale = new mapboxgl.ScaleControl({
          maxWidth: 80,
        })
        this.map.addControl(scale)
      }
    },
  },
})
</script>

<style>
.mapboxgl-ctrl-group {
  @apply space-y-3 contents;
}

.mapboxgl-ctrl-group > button,
.mapboxgl-ctrl-group > button:not(:disabled) {
  @apply text-sm font-bold text-zinc-800 bg-white rounded-full focus:rounded-full shadow-md focus:shadow-md outline-none w-11 h-11 focus:outline-none hover:bg-zinc-100 focus-visible:bg-zinc-100;
}

.mapboxgl-ctrl-compass {
  @apply overflow-hidden;
}
</style>
