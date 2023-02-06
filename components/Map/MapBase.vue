<template>
  <div id="map-container" class="w-full h-full flex flex-col">
    <Map
      :center="center"
      :bounds="bounds"
      :zoom="selectionZoom.poi"
      :fullscreen-control="fullscreenControl"
      :extra-attributions="extraAttributions"
      :map-style="mapStyle"
      :rotate="rotate"
      :show-attribution="showAttribution && !offMapAttribution"
      :hide-control="hideControl"
      :hash="hash"
      class="grow h-full"
      @map-init="
        onMapInit($event)
        $emit('map-init', $event)
      "
      @map-data="onMapRender('map-data', $event)"
      @map-dragend="onMapRender('map-dragend', $event)"
      @map-moveend="onMapRender('map-moveend', $event)"
      @map-resize="onMapRender('map-resize', $event)"
      @map-rotateend="onMapRender('map-rotateend', $event)"
      @map-touchmove="onMapRender('map-touchmove', $event)"
      @map-zoomend="onMapRender('map-zoomend', $event)"
      @map-style-load="
        onMapStyleLoad($event)
        $emit('map-style-load', $event)
      "
      @full-attribution="fullAttribution = $event"
    >
      <template #controls>
        <slot name="controls" />
      </template>
      <template #body>
        <slot name="body"></slot>
      </template>
    </Map>
    <Attribution
      v-if="showAttribution && offMapAttribution"
      :attribution="fullAttribution"
    />
  </div>
</template>

<script lang="ts">
import { PoiFilter } from '@teritorio/map'
import throttle from 'lodash.throttle'
import { FitBoundsOptions, LngLatBoundsLike, LngLatLike } from 'maplibre-gl'
import Vue, { PropType } from 'vue'

import Attribution from '~/components/Map/Attribution.vue'
import Map from '~/components/Map/Map.vue'
import { ApiPoi } from '~/lib/apiPois'
import { MAP_ZOOM } from '~/lib/constants'
import { MapPoi } from '~/lib/mapPois'
import { markerLayerTextFactory, updateMarkers } from '~/lib/markerLayerFactory'
import { MapStyleEnum } from '~/utils/types'

const POI_SOURCE = 'poi'
const POI_LAYER = 'poi'

export default Vue.extend({
  components: {
    Map,
    Attribution,
  },

  props: {
    center: {
      type: [Array, Object] as PropType<LngLatLike>,
      default: undefined,
    },
    bounds: {
      type: [Array, Object] as PropType<LngLatBoundsLike>,
      default: undefined,
    },
    fitBoundsPaddingOptions: {
      type: [Number, Object] as PropType<FitBoundsOptions['padding']>,
      default: 50,
    },
    extraAttributions: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    features: {
      type: Array as PropType<ApiPoi[]>,
      required: true,
    },
    fullscreenControl: {
      type: Boolean,
      default: false,
    },
    hash: {
      type: String,
      default: undefined,
    },
    mapStyle: {
      type: String as PropType<MapStyleEnum>,
      required: false,
    },
    rotate: {
      type: Boolean,
      default: false,
    },
    showAttribution: {
      type: Boolean,
      default: true,
    },
    offMapAttribution: {
      type: Boolean,
      default: false,
    },
    hideControl: {
      type: Boolean,
      default: false,
    },
    styleIconFilter: {
      type: Array as PropType<Array<string[]> | null>,
      default: null,
    },
  },

  data(): {
    map: maplibregl.Map
    poiFilter: PoiFilter | null
    poiLayerTemplate: maplibregl.LayerSpecification | undefined
    markers: { [id: string]: maplibregl.Marker }
    fullAttribution: string
  } {
    return {
      map: null!,
      poiFilter: null,
      poiLayerTemplate: undefined,
      markers: {},
      fullAttribution: '',
    }
  },

  computed: {
    selectionZoom() {
      return MAP_ZOOM.selectionZoom
    },
  },

  watch: {
    offMapAttribution() {
      this.$nextTick(() => this.map?.resize())
    },

    styleIconFilter() {
      this.setPoiFilter()
    },
  },

  created() {
    this.onMapRender = throttle(this.onMapRender, 200, {
      leading: true,
      trailing: true,
    })
  },

  methods: {
    fitBounds(bounds: LngLatBoundsLike, options: FitBoundsOptions = {}) {
      this.map.fitBounds(bounds, {
        maxZoom: 17,
        padding: this.fitBoundsPaddingOptions,
        ...options,
      })
    },

    initPoiLayer(
      features: MapPoi[],
      clusterPropertiesValues: string[],
      clusterPropertiesKeyExpression: maplibregl.ExpressionSpecification
    ) {
      if (this.map.getLayer(POI_LAYER)) {
        this.map.removeLayer(POI_LAYER)
      }
      if (this.map.getSource(POI_SOURCE)) {
        this.map.removeSource(POI_SOURCE)
      }

      // Create cluster properties, which will contain count of features per category

      const clusterProps: { [category: string]: object } = {}
      clusterPropertiesValues.forEach((clusterPropertiesValue) => {
        clusterProps[clusterPropertiesValue] = [
          '+',
          [
            'case',
            ['==', clusterPropertiesKeyExpression, clusterPropertiesValue],
            1,
            0,
          ],
        ]
      })

      if (!('#000000' in clusterProps)) {
        clusterProps['#000000'] = [
          '+',
          ['case', ['==', clusterPropertiesKeyExpression, null], 1, 0],
        ]
      }

      this.map.addSource(POI_SOURCE, {
        type: 'geojson',
        cluster: true,
        clusterRadius: 32,
        clusterProperties: clusterProps,
        clusterMaxZoom: 15,
        tolerance: 0.6,
        data: {
          type: 'FeatureCollection',
          features,
        },
      })

      // Add individual markers
      if (this.poiLayerTemplate)
        this.map.addLayer(
          markerLayerTextFactory(this.poiLayerTemplate, POI_LAYER, POI_SOURCE)
        )
    },

    onMapInit(map: maplibregl.Map) {
      this.map = map
    },

    onMapStyleLoad(style: maplibregl.StyleSpecification) {
      this.poiLayerTemplate = style.layers.find(
        (layer) => layer.id === 'poi-level-1'
      )

      this.poiFilter = new PoiFilter({
        filter: this.styleIconFilter || [],
      })
      this.map.addControl(this.poiFilter)
    },

    setPoiFilter() {
      if (this.styleIconFilter) {
        this.poiFilter?.setIncludeFilter(this.styleIconFilter)
      } else {
        this.poiFilter?.remove(true)
      }
    },

    onMapRender(eventName: string, event: any) {
      if (
        this.map &&
        this.map.getSource(POI_SOURCE) &&
        this.map.isSourceLoaded(POI_SOURCE)
      ) {
        this.markers = updateMarkers(
          this.map,
          this.markers,
          POI_SOURCE,
          this.fitBounds,
          (feature: ApiPoi) => this.$emit('feature-click', feature)
        )
      }

      this.$emit(eventName, event)
    },
  },
})
</script>

<style>
.cluster-item {
  cursor: pointer;
}

.cluster-donut {
  @apply text-sm leading-none font-medium block text-zinc-800;
}
</style>
