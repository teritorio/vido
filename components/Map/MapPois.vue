<script lang="ts">
import type { LngLatBounds, LngLatLike, Map } from 'maplibre-gl'
import type { PropType } from 'vue'
import { ref } from 'vue'

import { TeritorioCluster } from '@teritorio/maplibre-gl-teritorio-cluster'
import { storeToRefs } from 'pinia'
import { defineNuxtComponent } from '#app'
import MapBase from '~/components/Map/MapBase.vue'
import type { ApiPoi } from '~/lib/apiPois'
import { getBBoxFeatures } from '~/lib/bbox'
import { MAP_ZOOM } from '~/lib/constants'
import type { MapPoiId } from '~/lib/mapPois'
import { filterRouteByPoiIds } from '~/utils/styles'
import { clusterRender, markerRender, pinMarkerRender } from '~/lib/clusters'
import { mapStore as useMapStore } from '~/stores/map'
import { menuStore as useMenuStore } from '~/stores/menu'

const POI_SOURCE = 'poi'

export default defineNuxtComponent({
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
        LngLatBounds | undefined
      >,
      default: undefined,
    },
    cluster: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const { teritorioCluster } = storeToRefs(useMapStore())
    const { featuresColor } = storeToRefs(useMenuStore())

    return {
      mapBase: ref<InstanceType<typeof MapBase>>(),
      featuresColor,
      teritorioCluster,
    }
  },

  data(): {
    map: Map
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
      return this.bounds?.getCenter()
    },

    bounds(): LngLatBounds | undefined {
      return (
        getBBoxFeatures(
          this.features.filter(feature => feature.geometry),
        ) || this.defaultBounds
      )
    },
  },

  watch: {
    features() {
      if (!this.map)
        return

      this.mapBase!.initPoiLayer(this.features, this.featuresColor, [
        'case',
        ['all', ['has', 'display'], ['has', 'color_fill', ['get', 'display']]],
        ['get', 'color_fill', ['get', 'display']],
        '#000000',
      ], this.cluster)

      this.onMapStyleLoad()
    },
  },

  methods: {
    onMapInit(map: Map): void {
      this.map = map

      this.teritorioCluster = new TeritorioCluster(map, POI_SOURCE, {
        clusterRenderFn: clusterRender,
        fitBoundsOptions: this.mapBase?.fitBoundsOptions(),
        markerRenderFn: markerRender,
        markerSize: 32,
        pinMarkerRenderFn: pinMarkerRender,
      })
    },

    onMapStyleLoad(): void {
      if (this.featureIds)
        filterRouteByPoiIds(this.map as Map, this.featureIds)
    },
  },
})
</script>

<template>
  <MapBase
    ref="mapBase" :features="features" :center="center" :bounds="bounds" :zoom="selectionZoom.poi"
    :fullscreen-control="fullscreenControl" :extra-attributions="extraAttributions"
    :off-map-attribution="offMapAttribution" @map-init="onMapInit" @map-style-load="onMapStyleLoad"
  />
</template>
