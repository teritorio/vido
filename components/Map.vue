<template>
  <div class="w-full h-full">
    <div class="relative flex flex-col w-full h-full">
      <div id="map" class="flex-grow overflow-hidden"></div>

      <MapControls :map="map" />
      <MapAttribution />

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
import { mapGetters } from 'vuex'

// import MapPoiToast from '@/components/MapPoiToast.vue'
import MapAttribution from '@/components/MapAttribution.vue'
import MapControls from '@/components/MapControls.vue'

export default Vue.extend({
  components: {
    MapAttribution,
    MapControls,
    // MapPoiToast,
  },
  data(): {
    map: mapboxgl.Map | null
  } {
    return {
      map: null,
    }
  },
  computed: {
    ...mapGetters({
      mapConfig: 'config/map',
    }),
  },

  mounted() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: `https://vecto.teritorio.xyz/styles/teritorio-tourism-0.9/style.json?key=${this.$config.TILES_TOKEN}`,
      center: [this.mapConfig.center.lng, this.mapConfig.center.lat],
      zoom: this.mapConfig.zoom.default,
      maxZoom: this.mapConfig.zoom.max,
      hash: false,
      pitch: this.mapConfig.pitch,
    })

    this.map.once('load', (event) => {
      const map = event.target
      building3d(map).set3d(true, 60)
    })
  },
})
</script>
