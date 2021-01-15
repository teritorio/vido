<template>
  <div class="container">
    <div>
      <Logo />
      <h1 class="title">@teritorio/vido</h1>
      <div class="links">
        <button
          type="button"
          class="bg-blue-600 text-white font-medium px-6 py-3 rounded"
          @click="setFlat"
        >
          Flat
        </button>
        <button
          type="button"
          class="bg-blue-600 text-white font-medium px-6 py-3 rounded"
          @click="set3D"
        >
          3D
        </button>
      </div>
    </div>
    <div id="map"></div>
  </div>
</template>

<script lang="ts">
import { building3d } from '@teritorio/map'
import mapboxgl from 'mapbox-gl'
import Vue from 'vue'

export default Vue.extend({
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
      hash: true,
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

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
@apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
  padding-bottom: 15px;
}

#map {
  width: 500px;
  height: 500px;
}
</style>
