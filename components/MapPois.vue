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

import Map from '~/components/Map/Map.vue'
import { getBBoxFeatures } from '~/lib/bbox'
import { MAP_ZOOM } from '~/lib/constants'
import { ApiPoiId, MapPoiCollection } from '~/lib/mapPois'
import { makerHtmlFactory } from '~/lib/markerLayerFactory'
import { filterRouteByPoiId } from '~/utils/styles'
import { TupleLatLng } from '~/utils/types'

export default Vue.extend({
  components: {
    Map,
  },

  props: {
    extraAttributions: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    pois: {
      type: Object as PropType<MapPoiCollection>,
      default: null,
    },
    featureId: {
      type: Number as PropType<ApiPoiId>,
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
        if (this.featureId) {
          filterRouteByPoiId(map, this.featureId)
        }

        this.pois.features.forEach((poi) => {
          // @ts-ignore
          const id: ApiPoiId = poi.properties.metadata?.id

          if (poi.geometry.type === 'Point' && poi.properties.display) {
            makerHtmlFactory(
              `m${id}`,
              poi.geometry.coordinates as TupleLatLng,
              poi.properties.display.color_fill || '#000000',
              poi.properties.display.icon,
              poi.properties['image:thumbnail'],
              'lg'
            ).addTo(map)
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
