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

        <button
          v-if="map"
          :aria-label="$tc('mapControls.threeDAriaLabel')"
          type="button"
          :class="[
            'hidden items-center justify-center leading-none sm:flex text-sm font-bold rounded-full shadow-md w-11 h-11 outline-none focus:outline-none ',
            is3D &&
              'bg-blue-500 text-white hover:bg-blue-400 focus-visible:bg-blue-400',
            !is3D &&
              'bg-white text-gray-800 hover:bg-gray-100 focus-visible:bg-gray-100',
          ]"
          @click="toggle3D"
        >
          3D
        </button>

        <button
          v-if="map && !isModeExplorer"
          id="background-selector-map"
          aria-label="Changer le fond de carte"
          class="bg-gray-100 border-4 border-white rounded-full shadow-md outline-none w-11 h-11 focus:outline-none hover:bg-gray-100 focus-visible:bg-gray-100"
          :title="
            $t('mapControls.backgroundButton', {
              current: backgrounds[background],
            })
          "
          type="button"
          @click="displayNextBackground"
        >
          <img
            class="h-full rounded-full"
            alt="fond de carte"
            :src="require(`~/assets/${nextBackgroundName(background)}.png`)"
          />
        </button>

        <div v-if="map && isModeExplorer" class="w-11 h-11" />
      </div>
    </div>
  </aside>
</template>

<script lang="ts">
import { Building3d } from '@teritorio/map'
import maplibregl from 'maplibre-gl'
import Vue from 'vue'
import { mapGetters } from 'vuex'

import { Mode } from '@/utils/types'
import { getHashPart, setHashPart } from '@/utils/url'

export default Vue.extend({
  props: {
    hasFavorites: {
      type: Boolean,
      default: false,
    },
    backgrounds: {
      type: Object,
      default: null,
    },
    isModeFavorite: {
      type: Boolean,
      default: false,
    },
    initialBackground: {
      type: String,
      default: null,
    },
    map: {
      type: Object,
      default: null,
    },
    pitch: {
      type: Number,
      default: 0,
    },
    resizeMap: {
      type: Function,
      default: undefined,
    },
  },

  data(): {
    building3d: Building3d | null
    is3D: boolean
    background: string | null
  } {
    return {
      building3d: null,
      is3D: false,
      background: null,
    }
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

        this.building3d = new Building3d({
          building3d: this.is3D,
        })

        this.map.addControl(this.building3d)
      }
    },
    mode() {
      if (this.building3d) {
        this.building3d.set3d(this.is3D)
      }
    },
    pitch(value) {
      if (this.building3d) {
        this.building3d.set3d(value !== 0)
      }

      this.setIs3D(value !== 0)
    },
  },

  created() {
    this.setIs3D(this.pitch !== 0)
  },

  mounted() {
    if (getHashPart('bg') && this.backgrounds[getHashPart('bg') || '']) {
      this.background = getHashPart('bg')
    } else if (this.initialBackground) {
      this.background = this.initialBackground
    } else {
      this.displayNextBackground()
    }

    const mapParams: string | null = getHashPart('map')
    const params: string[] | undefined = mapParams?.split('/')

    if (params && params.length > 4) {
      this.setIs3D(true)
    }
  },

  methods: {
    setIs3D(value: boolean) {
      this.is3D = value
    },
    toggle3D() {
      this.tracking('3d')
      if (this.building3d) {
        if (this.is3D) {
          this.building3d.set3d(false, 0)
        } else {
          this.building3d.set3d(true, 60)
        }

        this.setIs3D(!this.is3D)
      }
    },
    displayNextBackground() {
      this.tracking('background')
      if (!this.background) {
        return
      }

      const nextBackgroundName = this.nextBackgroundName(this.background)
      this.background = nextBackgroundName
      setHashPart('bg', nextBackgroundName)
      this.$emit('changeBackground', nextBackgroundName)
    },
    nextBackgroundName(backgroundNameReference: string): string {
      const styleNames = ['teritorio', 'aerial', 'mapnik']

      const backgroundReferenceIndex = styleNames.findIndex(
        (styleName) => styleName === backgroundNameReference
      )
      const styleIndex =
        backgroundReferenceIndex + 1 > styleNames.length - 1
          ? 0
          : backgroundReferenceIndex + 1

      return styleNames[styleIndex]
    },
    toggleMode() {
      this.tracking('explorer')
      this.$emit(
        'change-mode',
        this.isModeExplorer ? Mode.BROWSER : Mode.EXPLORER
      )
    },
    tracking(event: '3d' | 'background' | 'explorer') {
      this.$tracking({ type: 'map_control_event', event })
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
