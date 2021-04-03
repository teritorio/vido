<template>
  <div
    class="absolute flex flex-col justify-center pointer-events-none inset-y-3 right-3"
  >
    <div class="flex flex-col pointer-events-auto space-y-9">
      <div class="flex flex-col space-y-3">
        <button
          aria-label="Zoomer"
          type="button"
          class="text-sm font-bold text-gray-800 bg-white rounded-full shadow-md outline-none w-11 h-11 focus:outline-none hover:bg-gray-100 focus-visible:bg-gray-100"
          @click="zoomIn"
        >
          <font-awesome-icon icon="plus" />
        </button>

        <button
          aria-label="Dézoomer"
          type="button"
          class="text-sm font-bold text-gray-800 bg-white rounded-full shadow-md outline-none w-11 h-11 focus:outline-none hover:bg-gray-100 focus-visible:bg-gray-100"
          @click="zoomOut"
        >
          <font-awesome-icon icon="minus" />
        </button>
      </div>

      <button
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
    </div>
  </div>
</template>

<script lang="ts">
import { Building3d } from '@teritorio/map'
import Vue from 'vue'

export default Vue.extend({
  props: {
    map: {
      type: Object,
      default: null,
    },
  },
  data(): {
    building3d: Building3d | null
    is3D: boolean
  } {
    return {
      building3d: null,
      is3D: false,
    }
  },
  methods: {
    toggle3D() {
      if (this.map) {
        if (!this.building3d) {
          this.building3d = new Building3d({
            building3d: true,
          })

          this.map.addControl(this.building3d)
        }

        if (this.is3D) {
          this.building3d.set3d(false, 0)
        } else {
          this.building3d.set3d(true, 60)
        }

        this.is3D = !this.is3D
      }
    },
    zoomIn() {
      if (this.map) {
        this.map.flyTo({ zoom: this.map.getZoom() + 1 })
      }
    },
    zoomOut() {
      if (this.map) {
        this.map.flyTo({ zoom: this.map.getZoom() - 1 })
      }
    },
  },
})
</script>
