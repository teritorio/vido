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
            position: 'bottom-right',
            show: true,
          }"
          @map-init="onMapInit"
          @map-pitchend="onMapPitchEnd"
        />
      </div>

      <MapControls :map="map" :pitch="pitch" />

      <!-- <div class="absolute flex justify-center inset-x-3 bottom-3">
      <MapPoiToast class="flex-grow-0" />
    </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import { PoiFilter } from '@teritorio/map'
import throttle from 'lodash.throttle'
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
    pitch: number
  } {
    return {
      map: null,
      pitch: 0,
    }
  },
  computed: {
    ...mapGetters({
      center: 'map/center',
      zoom: 'map/zoom',
    }),
    mapStyle(): string {
      return `https://vecto.teritorio.xyz/styles/teritorio-tourism-latest/style.json?key=${this.$config.TILES_TOKEN}`
    },
  },
  created() {
    this.pitch = this.$store.getters['map/pitch']

    this.onMapPitchEnd = throttle(this.onMapPitchEnd, 300)
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
    onMapPitchEnd(map: mapboxgl.Map) {
      this.pitch = map.getPitch()
    },
  },
})
</script>
