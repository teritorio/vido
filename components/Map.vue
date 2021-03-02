<template>
  <div class="w-full h-full">
    <div class="relative flex flex-col w-full h-full">
      <div id="map" class="flex-grow overflow-hidden"></div>

      <div class="absolute top-3 right-3">
        <button
          type="button"
          class="px-4 py-2 font-bold text-white bg-blue-500 rounded shadow-md hover:bg-blue-700"
          @click="setFlat"
        >
          Flat
        </button>
        <button
          type="button"
          class="px-4 py-2 font-bold text-white bg-blue-500 rounded shadow-md hover:bg-blue-700"
          @click="set3D"
        >
          3D
        </button>
      </div>

      <!-- <div class="absolute flex justify-center inset-x-3 bottom-3">
      <MapPoiToast class="flex-grow-0" />
    </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import { building3d } from '@teritorio/map'
import mapboxgl from 'mapbox-gl'
import Vue from 'vue'

// import MapPoiToast from '@/components/MapPoiToast.vue'

export default Vue.extend({
  // components: {
  //   MapPoiToast,
  // },
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
      style: `https://vecto.teritorio.xyz/styles/teritorio-tourism-0.9/style.json?key=${this.$config.TILES_TOKEN}`,
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
