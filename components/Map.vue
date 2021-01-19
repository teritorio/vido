<template>
  <div class="relative flex flex-col">
    <div id="map" class="flex-grow rounded-lg overflow-hidden shadow-md"></div>

    <div class="absolute top-3 right-3">
      <button
        type="button"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md"
        @click="setFlat"
      >
        Flat
      </button>
      <button
        type="button"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md"
        @click="set3D"
      >
        3D
      </button>
    </div>

    <div class="absolute inset-x-3 bottom-3 flex justify-center">
      <MapPoiToast class="flex-grow-0" />
    </div>
  </div>
</template>

<script lang="ts">
import { building3d } from '@teritorio/map'
import mapboxgl from 'mapbox-gl'
import Vue from 'vue'

import MapPoiToast from '@/components/MapPoiToast.vue'

export default Vue.extend({
  components: {
    MapPoiToast,
  },
  data(): {
    map: mapboxgl.Map | null
  } {
    return {
      map: null,
    }
  },
  mounted() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: `https://vecto.teritorio.xyz/styles/teritorio-tourism-0.9/style.json?key=${process.env.TILES_TOKEN}`,
      center: [-1.559646, 43.482489],
      zoom: 16.54,
      maxZoom: 20,
      hash: false,
      pitch: 60,
    })

    this.map.once('load', (event) => {
      const map = event.target
      building3d(map).set3d(true, 60)
    })
  },
  methods: {
    setFlat() {
      if (this.map) {
        building3d(this.map).set3d(false, 0)
      }
    },
    set3D() {
      if (this.map) {
        building3d(this.map).set3d(true, 60)
      }
    },
  },
})
</script>
