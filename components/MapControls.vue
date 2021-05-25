<template>
  <aside class="pointer-events-none">
    <div
      class="absolute flex items-center justify-end space-x-3 pointer-events-auto inset-x-3 top-3"
    >
      <button
        v-if="map"
        aria-label="Favoris"
        type="button"
        class="'text-sm font-medium px-5 space-x-1 rounded-full shadow-md h-11 outline-none focus:outline-none bg-white text-gray-800 hover:bg-gray-100 focus-visible:bg-gray-100',"
      >
        <font-awesome-icon icon="star" class="text-yellow-500" size="sm" />
        <span>Favoris</span>
      </button>

      <button
        v-if="map"
        aria-label="Navigation"
        type="button"
        class="'text-sm rounded-full shadow-md w-11 h-11 outline-none focus:outline-none bg-white text-gray-800 hover:bg-gray-100 focus-visible:bg-gray-100',"
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
            'text-sm font-bold rounded-full shadow-md w-11 h-11 outline-none focus:outline-none ',
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
          v-if="map"
          aria-label="Changer le fond de carte"
          :title="`Changer le fond de carte (actuellement ${backgrounds[background]})`"
          type="button"
          class="text-sm font-bold rounded-full shadow-md w-11 h-11 outline-none focus:outline-none bg-white text-gray-800 hover:bg-gray-100 focus-visible:bg-gray-100"
          @click="nextBackground"
        >
          <font-awesome-icon icon="map" class="text-gray-800" size="sm" />
        </button>
      </div>
    </div>
  </aside>
</template>

<script lang="ts">
import { Building3d } from '@teritorio/map'
import mapboxgl from 'mapbox-gl'
import Vue from 'vue'

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
      setHashPart('bg', this.background)
      this.$emit('changeBackground', this.background)
    },
  },
  created() {
    this.setIs3D(this.pitch !== 0)
  },

  mounted() {
    if (getHashPart('bg') && this.backgrounds[getHashPart('bg') || '']) {
      this.background = getHashPart('bg')
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
  },
})
</script>

<style>
.mapboxgl-ctrl {
  @apply space-y-3;

  display: contents;
}

.mapboxgl-ctrl > button,
.mapboxgl-ctrl > button:not(:disabled) {
  @apply text-sm font-bold text-gray-800 bg-white rounded-full focus:rounded-full shadow-md focus:shadow-md outline-none w-11 h-11 focus:outline-none hover:bg-gray-100 focus-visible:bg-gray-100;
}

.mapboxgl-ctrl-compass {
  @apply overflow-hidden;
}
</style>
