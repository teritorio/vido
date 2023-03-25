<template>
  <div id="map-container" class="tw-w-full tw-h-full tw-flex tw-flex-col">
    <Map
      :center="center"
      :bounds="bounds"
      :fit-bounds-options="fitBoundsOptions()"
      :zoom="selectionZoom.poi"
      :fullscreen-control="fullscreenControl"
      :extra-attributions="extraAttributions"
      :map-style="mapStyle"
      :rotate="rotate"
      :show-attribution="showAttribution && !offMapAttribution"
      :hide-control="hideControl"
      :hash="hash"
      :cooperative-gestures="cooperativeGestures"
      class="tw-grow tw-h-full"
      @map-init="onMapInit($event)"
      @map-data="onMapRender('map-data', $event)"
      @map-dragend="onMapRender('map-dragend', $event)"
      @map-moveend="onMapRender('map-moveend', $event)"
      @map-resize="onMapRender('map-resize', $event)"
      @map-rotateend="onMapRender('map-rotateend', $event)"
      @map-touchmove="onMapRender('map-touchmove', $event)"
      @map-zoomend="onMapRender('map-zoomend', $event)"
      @map-style-load="onMapStyleLoad($event)"
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
import copy from 'fast-copy'
import { Polygon, MultiPolygon } from 'geojson'
import throttle from 'lodash.throttle'
import {
  FitBoundsOptions,
  LngLatBoundsLike,
  LngLatLike,
  MapDataEvent,
  MapLibreEvent,
  MapTouchEvent,
} from 'maplibre-gl'
import { PropType } from 'vue'

import { defineNuxtComponent } from '#app'
import Attribution from '~/components/Map/Attribution.vue'
import Map from '~/components/Map/Map.vue'
import { ApiPoi } from '~/lib/apiPois'
import { MAP_ZOOM } from '~/lib/constants'
import { MapPoi } from '~/lib/mapPois'
import { markerLayerTextFactory, updateMarkers } from '~/lib/markerLayerFactory'
import { MapStyleEnum } from '~/utils/types'

const POI_SOURCE = 'poi'
const POI_LAYER = 'poi'

const BOUNDARY_SOURCE = 'boundary_area'
const BOUNDARY_AREA_LAYER = 'boundary_area'
const BOUNDAR_BORDER_LAYER = 'boundary_border'

export default defineNuxtComponent({
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
      type: String as PropType<string>,
      default: undefined,
    },
    mapStyle: {
      type: String as PropType<MapStyleEnum | undefined>,
      default: undefined,
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
    cooperativeGestures: {
      type: Boolean,
      default: false,
    },
    boundaryArea: {
      type: Object as PropType<Polygon | MultiPolygon | undefined>,
      default: undefined,
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
      if (this.styleIconFilter) {
        this.poiFilter?.setIncludeFilter(this.styleIconFilter)
      } else {
        this.poiFilter?.remove(true)
      }
    },
  },

  created() {
    this.onMapRender = throttle(this.onMapRender, 200, {
      leading: true,
      trailing: true,
    })
  },

  emits: {
    'map-init': (map: maplibregl.Map) => true,
    'map-data': (event: MapDataEvent & Object) => true,
    'map-dragend': (
      event: MapLibreEvent<MouseEvent | TouchEvent | undefined> & Object
    ) => true,
    'map-moveend': (
      event: MapLibreEvent<MouseEvent | TouchEvent | WheelEvent | undefined> &
        Object
    ) => true,
    'map-resize': (event: MapLibreEvent<undefined> & Object) => true,
    'map-rotateend': (
      event: MapLibreEvent<MouseEvent | TouchEvent | undefined> & Object
    ) => true,
    'map-touchmove': (event: MapTouchEvent & Object) => true,
    'map-zoomend': (
      event: MapLibreEvent<MouseEvent | TouchEvent | WheelEvent | undefined> &
        Object
    ) => true,
    'map-style-load': (style: maplibregl.StyleSpecification) => true,
    'feature-click': (feature: ApiPoi) => true,
  },

  methods: {
    fitBoundsOptions(options: FitBoundsOptions = {}): FitBoundsOptions {
      return {
        maxZoom: 17,
        padding: this.fitBoundsPaddingOptions,
        ...options,
      }
    },

    fitBounds(bounds: LngLatBoundsLike, options: FitBoundsOptions = {}): void {
      this.map.fitBounds(bounds, this.fitBoundsOptions(options))
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
      this.$emit('map-init', map)
    },

    onMapStyleLoad(style: maplibregl.StyleSpecification) {
      this.poiLayerTemplate = style.layers.find(
        (layer) => layer.id === 'poi-level-1'
      )

      this.poiFilter = new PoiFilter({
        filter: this.styleIconFilter || [],
      })
      this.map.addControl(this.poiFilter)

      if (this.boundaryArea) {
        const inverse = copy(this.boundaryArea)
        if (inverse.type === 'Polygon') {
          inverse.coordinates = [
            [
              [-180, -90],
              [180, -90],
              [180, 90],
              [-180, 90],
              [-180, -90],
            ],
            ...inverse.coordinates,
          ]
        } else {
          inverse.coordinates = [
            [
              [
                [-180, -90],
                [180, -90],
                [180, 90],
                [-180, 90],
                [-180, -90],
              ],
              ...inverse.coordinates[0],
            ],
          ]
        }

        this.map.addSource(BOUNDARY_SOURCE, {
          type: 'geojson',
          data: inverse,
        })

        let firstSymbolLayerId: string | undefined = this.map
          .getStyle()
          .layers.find((layer) => layer.type === 'line')?.id
        this.map.addLayer(
          {
            id: BOUNDARY_AREA_LAYER,
            source: BOUNDARY_SOURCE,
            type: 'fill',
            paint: {
              'fill-color': 'rgba(185, 185, 185, 0.46)',
              'fill-opacity': 0.8,
            },
          },
          firstSymbolLayerId
        )
        this.map.addLayer(
          {
            id: BOUNDAR_BORDER_LAYER,
            source: BOUNDARY_SOURCE,
            type: 'line',
            paint: {
              'line-color': 'rgba(185, 185, 185, 0.46)',
              'line-width': 3,
            },
          },
          firstSymbolLayerId
        )
      }

      this.$emit('map-style-load', style)
    },

    onMapRender(
      eventName:
        | 'map-data'
        | 'map-dragend'
        | 'map-moveend'
        | 'map-resize'
        | 'map-rotateend'
        | 'map-touchmove'
        | 'map-zoomend',
      event: any
    ) {
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

      // @ts-ignore
      this.$emit(eventName, event)
    },
  },
})
</script>

<style scoped>
:deep(.cluster-item) {
  cursor: pointer;
}

:deep(.cluster-donut) {
  @apply tw-text-sm tw-leading-none tw-font-medium tw-block tw-text-zinc-800;
}
</style>
