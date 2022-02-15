<template>
  <div>
    <Map
      v-if="poi.geometry.coordinates"
      :center="poi.geometry.coordinates"
      :zoom="selectionZoom.poi"
      @map-init="onMapInit"
    />
  </div>
</template>

<script lang="ts">
import { PoiFilter } from '@teritorio/map'
import Vue, { PropType } from 'vue'

import Map from '@/components/Map/Map.vue'
import { VidoFeature } from '@/lib/apiPois'
import { MAP_ZOOM } from '@/lib/constants'
import { markerLayerFactory } from '@/lib/markerLayerFactory'

export default Vue.extend({
  components: {
    Map,
  },

  props: {
    poi: {
      type: Object as PropType<VidoFeature>,
      default: null,
    },
  },

  computed: {
    selectionZoom() {
      return MAP_ZOOM.selectionZoom
    },
  },

  methods: {
    onMapInit(map: maplibregl.Map) {
      map.addControl(new PoiFilter({ filter: [] }))

      map.once('styledata', () => {
        map.addSource('poi', {
          type: 'geojson',
          data: this.poi,
        })
        map.addLayer(markerLayerFactory('poi', 'poi'))
      })
    },
  },
})
</script>
