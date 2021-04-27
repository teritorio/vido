<template>
  <div class="w-full h-full">
    <div class="relative flex flex-col w-full h-full">
      <div id="map" class="flex-grow overflow-hidden">
        <mapbox
          access-token=""
          :map-options="{
            center: [center.lng, center.lat],
            hash: false,
            maxZoom: zoom.max,
            minZoom: zoom.min,
            pitch,
            style: mapStyle,
            zoom: zoom.default,
          }"
          :nav-control="{
            show: false,
          }"
          :attribution-control="{
            show: true,
            position: 'bottom-right',
          }"
          @map-init="onMapInit"
        />
      </div>

      <MapControls :map="map" />

      <!-- <div class="absolute flex justify-center inset-x-3 bottom-3">
      <MapPoiToast class="flex-grow-0" />
    </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import { PoiFilter } from '@teritorio/map'
import mapboxgl from 'mapbox-gl'
import Mapbox from 'mapbox-gl-vue'
import Vue from 'vue'
import { mapGetters } from 'vuex'

// import MapPoiToast from '@/components/MapPoiToast.vue'
import MapControls from '@/components/MapControls.vue'

export default Vue.extend({
  components: {
    Mapbox,
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
      center: 'map/center',
      pitch: 'map/pitch',
      zoom: 'map/zoom',
    }),
    mapStyle(): string {
      return `https://vecto.teritorio.xyz/styles/teritorio-tourism-latest/style.json?key=${this.$config.TILES_TOKEN}`
    },
  },
  methods: {
    onMapInit(map: mapboxgl.Map) {
      this.map = map

      this.map.addControl(
        new PoiFilter({
          filter: [
            // ['catering', 'food', 'restaurant'],
            // ['leisure', 'park'],
          ],
          include: true,
        })
      )
    },
  },
})
</script>
