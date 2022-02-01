<template>
  <aside class="pointer-events-none hidden sm:block">
    <div class="absolute flex flex-col justify-center inset-y-3 right-3">
      <div class="flex flex-col space-y-3 pointer-events-auto">
        <div ref="navigationControlContainer"></div>
        <div ref="geolocateControlContainer" class="sm:hidden"></div>

        <button
          v-if="map"
          :aria-label="$tc('mapControls.exploreAriaLabel')"
          :title="$tc('mapControls.exploreButton')"
          type="button"
          :class="[
            'hidden sm:block text-sm font-bold rounded-full shadow-md w-11 h-11 outline-none focus:outline-none ',
            isModeExplorer &&
              'bg-blue-500 hover:bg-blue-400 focus-visible:bg-blue-400',
            !isModeExplorer &&
              'bg-white hover:bg-gray-100 focus-visible:bg-gray-100',
          ]"
          @click="toggleMode"
        >
          <font-awesome-icon
            icon="eye"
            :class="[
              isModeExplorer && 'text-white',
              !isModeExplorer && 'text-gray-800',
            ]"
            size="lg"
          />
        </button>

        <slot v-if="map"></slot>
      </div>
    </div>
  </aside>
</template>

<script lang="ts">
import maplibregl from 'maplibre-gl'
import Vue from 'vue'
import { mapGetters } from 'vuex'

import { Mode } from '@/utils/types'

export default Vue.extend({
  props: {
    map: {
      type: Object,
      default: null,
    },
    resizeMap: {
      type: Function,
      default: undefined,
    },
  },

  computed: {
    ...mapGetters({
      mode: 'site/mode',
    }),

    isModeExplorer(): boolean {
      return this.mode === Mode.EXPLORER
    },
  },

  watch: {
    map(value, oldValue) {
      if (!oldValue && value) {
        const navigationControl = new maplibregl.NavigationControl({
          showCompass: true,
          showZoom: true,
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

  methods: {
    toggleMode() {
      this.$tracking({ type: 'map_control_event', event: 'explorer' })
      this.$emit(
        'change-mode',
        this.isModeExplorer ? Mode.BROWSER : Mode.EXPLORER
      )
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
