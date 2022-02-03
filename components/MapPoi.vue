<template>
  <div>
    <Map
      v-if="poi.geometry.coordinates"
      :center="poi.geometry.coordinates"
      :zoom="selectionZoom.zoom_poi"
      @map-init="onMapInit"
    />
  </div>
</template>

<script lang="ts">
import { PoiFilter } from '@teritorio/map'
import Vue, { PropType } from 'vue'
import { mapGetters } from 'vuex'

import Map from '@/components/Map/Map.vue'
import { markerLayerFactory } from '@/lib/markerLayerFactory'

import { VidoFeature } from '~/utils/types'

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
    ...mapGetters({
      selectionZoom: 'map/selectionZoom',
    }),
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
