<template>
  <MapBase
    ref="mapBase"
    :features="features"
    :center="center"
    :bounds="bounds"
    :zoom="selectionZoom.poi"
    :fullscreen-control="fullscreenControl"
    :extra-attributions="extraAttributions"
    :off-map-attribution="offMapAttribution"
    @map-init="onMapInit"
    @map-style-load="onMapStyleLoad"
  />
</template>

<script lang="ts">
import { LngLatLike } from 'maplibre-gl'
import { defineComponent, PropType, ref } from 'vue'

import MapBase from '~/components/Map/MapBase.vue'
import { ApiPoi } from '~/lib/apiPois'
import { getBBoxFeatures } from '~/lib/bbox'
import { MAP_ZOOM } from '~/lib/constants'
import { MapPoiId } from '~/lib/mapPois'
import { filterRouteByPoiIds } from '~/utils/styles'

export default defineComponent({
  components: {
    MapBase,
  },

  props: {
    extraAttributions: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    offMapAttribution: {
      type: Boolean,
      default: false,
    },
    features: {
      type: Array as PropType<ApiPoi[]>,
      required: true,
    },
    featureIds: {
      type: Array as PropType<MapPoiId[] | null>,
      default: null,
    },
    fullscreenControl: {
      type: Boolean,
      default: false,
    },
    defaultBounds: {
      type: [Array, Object] as PropType<
        maplibregl.LngLatBoundsLike | undefined
      >,
      default: undefined,
    },
  },
  setup() {
    return {
      mapBase: ref<InstanceType<typeof MapBase>>(),
    }
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

    center(): LngLatLike | undefined {
      if (
        this.features.length === 1 &&
        this.features[0].geometry.type === 'Point'
      ) {
        return this.features[0].geometry.coordinates as LngLatLike
      } else {
        return undefined
      }
    },

    bounds(): maplibregl.LngLatBoundsLike | undefined {
      if (
        this.features.length > 1 ||
        (this.features.length === 1 &&
          this.features[0].geometry.type !== 'Point')
      ) {
        return (
          getBBoxFeatures(
            this.features.filter((feature) => feature.geometry)
          ) || this.defaultBounds
        )
      } else {
        return this.defaultBounds
      }
    },
  },

  watch: {
    features() {
      if (this.map) {
        // @ts-ignore
        this.onMapStyleLoad()
      }
    },
  },

  methods: {
    onMapInit(map: maplibregl.Map): void {
      this.map = map
    },

    onMapStyleLoad(style: maplibregl.StyleSpecification): void {
      const colors = [
        ...new Set(
          this.features.map(
            (feature) => feature.properties?.display?.color_fill || '#000000'
          )
        ),
      ]
      this.mapBase!.initPoiLayer(this.features, colors, [
        'case',
        ['all', ['has', 'display'], ['has', 'color_fill', ['get', 'display']]],
        ['get', 'color_fill', ['get', 'display']],
        '#000000',
      ])

      if (this.featureIds) {
        filterRouteByPoiIds(this.map, this.featureIds)
      }
    },
  },
})
</script>
