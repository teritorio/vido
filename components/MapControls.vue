<template>
  <aside class="pointer-events-none">
    <div
      class="absolute flex items-top justify-end space-x-3 pointer-events-auto inset-x-3 top-3"
    >
      <button
        v-if="map"
        aria-label="Favoris"
        type="button"
        class="hidden sm:block text-sm font-medium px-5 space-x-1 rounded-full shadow-md h-11 outline-none focus:outline-none bg-white text-gray-800 hover:bg-gray-100 focus-visible:bg-gray-100"
      >
        <font-awesome-icon icon="star" class="text-yellow-500" size="sm" />
        <span>Favoris</span>
      </button>

      <button
        v-if="map"
        aria-label="Navigation"
        type="button"
        class="hidden sm:block text-sm rounded-full shadow-md w-11 h-11 outline-none focus:outline-none bg-white text-gray-800 hover:bg-gray-100 focus-visible:bg-gray-100"
      >
        <font-awesome-icon icon="bars" class="text-gray-800" size="sm" />
      </button>
    </div>

    <div class="absolute flex flex-col justify-center inset-y-3 right-3">
      <div class="flex flex-col space-y-3 pointer-events-auto">
        <div ref="navigationControlContainer"></div>

        <button
          v-if="map"
          aria-label="Visualiser la carte en 3D"
          type="button"
          :class="[
            'hidden sm:block text-sm font-bold rounded-full shadow-md w-11 h-11 outline-none focus:outline-none ',
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
          aria-label="Changer le fond de carte"
          :title="`Changer le fond de carte (actuellement ${backgrounds[background]})`"
          type="button"
          class="text-sm font-bold text-gray-800 bg-white rounded-full shadow-md outline-none w-11 h-11 focus:outline-none hover:bg-gray-100 focus-visible:bg-gray-100"
          @click="nextBackground"
        >
          <font-awesome-icon icon="map" class="text-gray-800" size="lg" />
        </button>

        <button
          v-if="map"
          aria-label="Mode Explore"
          title="Basculer en mode Explore"
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
      </div>
    </div>
  </aside>
</template>

<script lang="ts">
import { Building3d } from '@teritorio/map'
import mapboxgl from 'maplibre-gl'
import Vue from 'vue'
import { mapGetters } from 'vuex'

import { Mode } from '@/utils/types'
import { getHashPart, setHashPart } from '@/utils/url'

export default Vue.extend({
  props: {
    map: {
      type: Object,
      default: null,
    },
    pitch: {
      type: Number,
      default: 0,
    },
    backgrounds: {
      type: Object,
      default: null,
    },
    initialBackground: {
      type: String,
      default: null,
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

    isModeExplorer() {
      return this.mode === Mode.EXPLORER
    },
  },

  watch: {
    map(value, oldValue) {
      if (!oldValue && value) {
        const navigationControl = new mapboxgl.NavigationControl({
          showCompass: true,
          showZoom: true,
          visualizePitch: true,
        })

        ;(this.$refs.navigationControlContainer as HTMLDivElement).appendChild(
          navigationControl.onAdd(this.map)
        )

        this.building3d = new Building3d({
          building3d: this.is3D,
        })

        this.map.addControl(this.building3d)
      }
    },
    pitch(value) {
      if (this.building3d) {
        this.building3d.set3d(value !== 0)
      }

      this.setIs3D(value !== 0)
    },
    background() {
      setHashPart('bg', this.background || '')
      this.$emit('changeBackground', this.background)
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
      this.nextBackground()
    }
  },

  methods: {
    setIs3D(value: boolean) {
      this.is3D = value
    },
    toggle3D() {
      if (this.building3d) {
        if (this.is3D) {
          this.building3d.set3d(false, 0)
        } else {
          this.building3d.set3d(true, 60)
        }

        this.setIs3D(!this.is3D)
      }
    },
    nextBackground() {
      const backs = Object.keys(this.backgrounds)
      const lastId = this.background
        ? backs.findIndex((b) => b === this.background)
        : -1
      this.background = backs[(lastId + 1) % backs.length]
    },
    toggleMode() {
      this.$store.dispatch(
        'site/setMode',
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
  @apply text-xs px-1 py-0.5;
}
</style>
