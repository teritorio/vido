<template>
  <div class="w-full h-full">
    <div class="relative flex flex-col w-full h-full">
      <div id="map" class="flex-grow overflow-hidden">
        <mapbox
          access-token=""
          :map-options="{
            style: mapStyle,
            center: [mapConfig.center.lng, mapConfig.center.lat],
            zoom: mapConfig.zoom.default,
            maxZoom: mapConfig.zoom.max,
            minZoom: mapConfig.zoom.min,
            hash: false,
            pitch: mapConfig.pitch,
          }"
          @map-init="onMapInit"
          @map-load="onMapLoad"
        />
      </div>
      <MapControls :map="map" />
      <MapAttribution />

      <!-- <div class="absolute flex justify-center inset-x-3 bottom-3">
      <MapPoiToast class="flex-grow-0" />
    </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import { poiFilter } from '@teritorio/map'
import mapboxgl from 'mapbox-gl'
import Mapbox from 'mapbox-gl-vue'
import Vue from 'vue'
import { mapGetters } from 'vuex'

// import MapPoiToast from '@/components/MapPoiToast.vue'
import MapAttribution from '@/components/MapAttribution.vue'
import MapControls from '@/components/MapControls.vue'

export default Vue.extend({
  components: {
    MapAttribution,
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
      mapConfig: 'config/map',
    }),
    mapStyle(): string {
      return `https://vecto.teritorio.xyz/styles/teritorio-tourism-0.9/style.json?key=${this.$config.TILES_TOKEN}`
    },
  },
  methods: {
    onMapInit(map: mapboxgl.Map) {
      this.map = map
    },
    onMapLoad(map: mapboxgl.Map) {
      poiFilter(map).remove(true)
    },
  },
})
</script>
