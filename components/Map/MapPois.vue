<template>
  <MapBase
    ref="mapBase"
    :features="features"
    :center="center"
    :bounds="bounds"
    :zoom="selectionZoom.poi"
    :fullscreen-control="fullscreenControl"
    :extra-attributions="extraAttributions"
    @map-init="onMapInit"
    @map-style-load="onMapStyleLoad"
  />
</template>

<script lang="ts">
import Vue, { PropType, VueConstructor } from 'vue'

import MapBase from '~/components/Map/MapBase.vue'
import { ApiPoi } from '~/lib/apiPois'
import { getBBoxFeatures } from '~/lib/bbox'
import { MAP_ZOOM } from '~/lib/constants'
import { MapPoiId } from '~/lib/mapPois'
import { filterRouteByPoiId } from '~/utils/styles'

export default (
  Vue as VueConstructor<
    Vue & {
      $refs: {
        mapBase: InstanceType<typeof MapBase>
      }
    }
  >
).extend({
  components: {
    MapBase,
  },

  props: {
    extraAttributions: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    features: {
      type: Array as PropType<ApiPoi[]>,
      required: true,
    },
    featureId: {
      type: Number as PropType<MapPoiId | null>,
      default: null,
    },
    fullscreenControl: {
      type: Boolean,
      default: false,
    },
  },

  data(): {
    map: maplibregl.Map
  } {
    return {
      map: null!,
    }
  },

  computed: {
    selectionZoom() {
      return MAP_ZOOM.selectionZoom
    },

    center() {
      if (
        this.features.length === 1 &&
        this.features[0].geometry.type === 'Point'
      ) {
        return this.features[0].geometry.coordinates
      } else {
        return undefined
      }
    },

    bounds() {
      if (
        this.features.length > 1 ||
        this.features[0].geometry.type !== 'Point'
      ) {
        return getBBoxFeatures(this.features)
      } else {
        return undefined
      }
    },
  },

  methods: {
    onMapInit(map: maplibregl.Map) {
      this.map = map
    },

    onMapStyleLoad(style: maplibregl.StyleSpecification) {
      const colors = [
        ...new Set(
          this.features.map(
            (feature) => feature.properties?.display?.color_fill || '#000000'
          )
        ),
      ]
      this.$refs.mapBase.initPoiLayer(this.features, colors, [
        'case',
        ['all', ['has', 'display'], ['has', 'color_fill', ['get', 'display']]],
        ['get', 'color_fill', ['get', 'display']],
        '#000000',
      ])

      if (this.featureId) {
        filterRouteByPoiId(this.map, this.featureId)
      }
    },
  },
})
</script>