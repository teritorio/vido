<template>
  <div>
    <Map
      v-if="pois && pois.features.length > 0"
      :center="center()"
      :bounds="bounds()"
      :zoom="selectionZoom.poi"
      :extra-attributions="extraAttributions"
      @map-init="onMapInit"
    />
  </div>
</template>

<script lang="ts">
import { PoiFilter } from '@teritorio/map'
import Vue, { PropType } from 'vue'

import Map from '@/components/Map/Map.vue'
import { ApiPois } from '@/lib/apiPois'
import { getBBoxFeatures } from '@/lib/bbox'
import { MAP_ZOOM } from '@/lib/constants'
import { makerHtmlFactory } from '@/lib/markerLayerFactory'
import { filterRouteByPoiId } from '@/utils/styles'

import { TupleLatLng } from '~/utils/types'

export default Vue.extend({
  components: {
    Map,
  },

  props: {
    extraAttributions: {
      type: Array as PropType<string[]>,
      required: true,
    },
    pois: {
      type: Object as PropType<ApiPois>,
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
        this.pois.features.forEach((poi) => {
          if (poi.geometry.type === 'Point' && poi.properties.display) {
            makerHtmlFactory(
              poi.geometry.coordinates as TupleLatLng,
              poi.properties.display.color_fill,
              poi.properties.display.icon,
              poi.properties['image:thumbnail'],
              'lg'
            ).addTo(map)
          }

          if (poi.properties.metadata?.id) {
            filterRouteByPoiId(map, poi.properties.metadata?.id)
          }
        })
      })
    },

    center() {
      if (
        this.pois.features.length === 1 &&
        this.pois.features[0].geometry.type === 'Point'
      ) {
        return this.pois.features[0].geometry.coordinates
      } else {
        return undefined
      }
    },

    bounds() {
      if (
        this.pois.features.length > 1 ||
        this.pois.features[0].geometry.type !== 'Point'
      ) {
        return getBBoxFeatures(this.pois.features)
      } else {
        return undefined
      }
    },
  },
})
</script>
