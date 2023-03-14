<template>
  <div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import {
  Map,
  NavigationControl,
  GeolocateControl,
  FullscreenControl,
  ScaleControl,
} from 'maplibre-gl'
import { PropType } from 'vue'

import { defineNuxtComponent } from '#app'

export default defineNuxtComponent({
  props: {
    map: {
      type: Object as PropType<Map>,
      required: true,
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

  data(): {
    fullscreenControlObject: FullscreenControl
  } {
    return {
      fullscreenControlObject: new FullscreenControl({}),
    }
  },

  mounted() {
    this.map.addControl(
      new NavigationControl({
        showZoom: true,
        showCompass: this.showCompass,
        visualizePitch: true,
      })
    )

    const geolocateControl = new GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
    })
    this.map.addControl(geolocateControl)
    geolocateControl._container.classList.add('control-geolocate')

    if (this.fullscreenControl) {
      this.map.addControl(this.fullscreenControlObject)
    }

    this.map.addControl(
      new ScaleControl({
        maxWidth: 80,
      })
    )
  },

  watch: {
    fullscreenControl() {
      if (this.fullscreenControl) {
        this.map.addControl(this.fullscreenControlObject!)
      } else {
        this.map.removeControl(this.fullscreenControlObject!)
      }
    },
  },
})
</script>

<style lang="scss">
#map .maplibregl-ctrl-group {
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
