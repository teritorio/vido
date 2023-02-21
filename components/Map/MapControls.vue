<template>
  <div class="hidden">
    <mgl-navigation-control
      :show-zoom="true"
      :show-compass="showCompass"
      :visualize-pitch="true"
    />
    <mgl-geolocation-control
      class="control-geolocate"
      :position-options="{ enableHighAccuracy: true }"
      :track-user-location="true"
    />
    <mgl-fullscreen-control v-if="fullscreenControl" />
    <mgl-scale-control max-width="80" />
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    showCompass: {
      type: Boolean,
      default: false,
    },
    fullscreenControl: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style lang="scss">
@import '@vladvesa/vue-maplibre-gl/src/css/maplibre';

#map .maplibre-ctrl-group {
  @apply mt-2 mb-2;

  background: none;
}

#map .maplibregl-ctrl-group:not(:empty) {
  box-shadow: none;
}

#map .maplibregl-ctrl-group > button,
#map .maplibregl-ctrl-group > button:not(:disabled) {
  border: none;
  @apply text-sm font-bold text-zinc-800 bg-white rounded-full shadow-md outline-none w-11 h-11;
  @apply focus:rounded-full focus:shadow-md focus:outline-none focus-visible:bg-zinc-100;
  @apply hover:bg-zinc-100;
}

#map .maplibregl-ctrl-group > button.maplibregl-ctrl-active,
#map .maplibregl-ctrl-group > button.maplibregl-ctrl-active:not(:disabled) {
  @apply bg-blue-500 text-white hover:bg-blue-400 focus-visible:bg-blue-400;
}

#map .maplibregl-ctrl-top-right {
  @apply flex flex-col justify-center inset-y-3;
}

#map .maplibregl-ctrl-attrib {
  font-size: 0.75rem;
  line-height: 1rem;
}

.control-geolocate {
  @apply md:hidden;
}
</style>
