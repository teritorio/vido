<template>
  <aside class="pointer-events-none hidden sm:block">
    <div class="absolute flex flex-col justify-center inset-y-3 right-3">
      <div class="flex flex-col space-y-3 pointer-events-auto">
        <div ref="navigationControlContainer"></div>
        <div ref="geolocateControlContainer" class="sm:hidden"></div>
        <slot v-if="map"></slot>
      </div>
    </div>
  </aside>
</template>

<script lang="ts">
import maplibregl from 'maplibre-gl'
import Vue from 'vue'

export default Vue.extend({
  props: {
    map: {
      type: Object,
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
  @apply text-sm font-bold text-gray-800 bg-white rounded-full focus:rounded-full shadow-md focus:shadow-md outline-none w-11 h-11 focus:outline-none hover:bg-gray-100 focus-visible:bg-gray-100;
}

.mapboxgl-ctrl-compass {
  @apply overflow-hidden;
}

.mapboxgl-ctrl.mapboxgl-ctrl-attrib {
  @apply text-xs px-1 py-0.5 rounded-tl-sm;
}

.mapboxgl-ctrl.mapboxgl-ctrl-attrib.mapboxgl-compact {
  min-height: 24px;

  @apply pl-2 pr-8 py-1 rounded-sm;
}

.mapboxgl-ctrl.mapboxgl-ctrl-attrib.mapboxgl-compact:not(.mapboxgl-compact-show) {
  @apply bg-transparent;
}

.mapboxgl-ctrl.mapboxgl-ctrl-attrib.mapboxgl-compact.mapboxgl-compact-show
  .mapboxgl-ctrl-attrib-button {
  @apply bg-transparent;
}
</style>
