<template>
  <div>
    <Map
      v-if="poi.geometry.coordinates"
      :center="
        (poi.geometry.type === 'Point' && poi.geometry.coordinates) || undefined
      "
      :bounds="(poi.geometry.type !== 'Point' && bounds()) || undefined"
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
import { getBBoxFeature } from '@/lib/bbox'
import { MAP_ZOOM } from '@/lib/constants'
import { makerHtmlFactory } from '@/lib/markerLayerFactory'
import { filterRouteByPoiId } from '@/utils/styles'

import { TupleLatLng } from '~/utils/types'

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
        if (this.poi.geometry.type === 'Point') {
          makerHtmlFactory(
            this.poi.geometry.coordinates as TupleLatLng,
            this.poi.properties.display?.color,
            this.poi.properties.display?.icon,
            this.poi.properties['image:thumbnail'],
            'lg'
          ).addTo(map)
        }

        if (this.poi.properties.metadata?.id) {
          filterRouteByPoiId(map, this.poi.properties.metadata?.id)
        }
      })
    },

    bounds() {
      return getBBoxFeature(this.poi)
    },
  },
})
</script>
