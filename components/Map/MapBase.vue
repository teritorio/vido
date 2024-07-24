<script lang="ts">
import { PoiFilter } from '@teritorio/map'
import copy from 'fast-copy'
import type { MultiLineString, MultiPoint, MultiPolygon, Polygon } from 'geojson'
import throttle from 'lodash.throttle'
import type {
  FitBoundsOptions,
  LayerSpecification,
  LngLatBounds,
  LngLatLike,
  MapDataEvent,
  MapLibreEvent,
  MapTouchEvent,
  Marker,
} from 'maplibre-gl'
import type { PropType } from 'vue'

import { defineNuxtComponent } from '#app'
import Attribution from '~/components/Map/Attribution.vue'
import Map from '~/components/Map/Map.vue'
import type { ApiPoi } from '~/lib/apiPois'
import { MAP_ZOOM } from '~/lib/constants'
import type { MapPoi } from '~/lib/mapPois'
import { markerLayerTextFactory, updateMarkers } from '~/lib/markerLayerFactory'
import type { MapStyleEnum } from '~/utils/types'

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
      type: [Array, Object] as PropType<LngLatBounds>,
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
      if (this.styleIconFilter)
        this.poiFilter?.setIncludeFilter(this.styleIconFilter)
      else
        this.poiFilter?.remove(true)
    },
  },

  created() {
    this.onMapRender = throttle(this.onMapRender, 200, {
      leading: true,
      trailing: true,
    })
  },

  emits: {
    mapInit: (_map: maplibregl.Map) => true,
    mapData: (_event: MapDataEvent & object) => true,
    mapDragEnd: (
      _event: MapLibreEvent<MouseEvent | TouchEvent | undefined> & object,
    ) => true,
    mapMoveEnd: (
      _event: MapLibreEvent<MouseEvent | TouchEvent | WheelEvent | undefined> &
      object,
    ) => true,
    mapResize: (_event: MapLibreEvent<undefined> & object) => true,
    mapRotateEnd: (
      _event: MapLibreEvent<MouseEvent | TouchEvent | undefined> & object,
    ) => true,
    mapTouchMove: (_event: MapTouchEvent & object) => true,
    mapZoomEnd: (
      _event: MapLibreEvent<MouseEvent | TouchEvent | WheelEvent | undefined> &
      object,
    ) => true,
    mapStyleLoad: (_style: maplibregl.StyleSpecification) => true,
    featureClick: (_feature: ApiPoi, _marker?: Marker) => true,
  },

  methods: {
    fitBoundsOptions(options: FitBoundsOptions = {}): FitBoundsOptions {
      return {
        maxZoom: 17,
        padding: this.fitBoundsPaddingOptions,
        ...options,
      }
    },

    fitBounds(bounds: LngLatBounds, options: FitBoundsOptions = {}): void {
      this.map.fitBounds(bounds, this.fitBoundsOptions(options))
    },

    featuresPrepare(features: ApiPoi[]): ApiPoi[] {
      return features.map((feature) => {
        if (feature.geometry && ['MultiPoint', 'MultiLineString', 'MultiPolygon'].includes(feature.geometry.type)) {
          return (feature.geometry as (MultiPoint | MultiLineString | MultiPolygon)).coordinates.map(coordinates => ({
            type: 'Feature',
            properties: feature.properties,
            geometry: {
              type: feature.geometry.type.substring(5) as ('Point' | 'LineString' | 'Polygon'),
              coordinates,
            },
          } as ApiPoi))
        }
        else {
          return [feature]
        }
      })
        .flat()
        .filter(feature => !!feature)
        .map((feature, index) => {
          feature.id = index
          return feature
        })
    },

    initPoiLayer(
      features: MapPoi[],
      clusterPropertiesValues: string[],
      clusterPropertiesKeyExpression: maplibregl.ExpressionSpecification,
      cluster?: boolean,
    ) {
      if (this.map.getLayer(POI_LAYER))
        this.map.removeLayer(POI_LAYER)

      if (this.map.getSource(POI_SOURCE))
        this.map.removeSource(POI_SOURCE)

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
        cluster: cluster === undefined ? true : cluster,
        clusterRadius: 32,
        clusterProperties: clusterProps,
        clusterMaxZoom: 15,
        tolerance: 0.6,
        data: {
          type: 'FeatureCollection',
          features: this.featuresPrepare(features as ApiPoi[]),
        },
      })

      // Add individual markers
      if (this.poiLayerTemplate) {
        this.map.addLayer(
          markerLayerTextFactory(
            this.poiLayerTemplate as LayerSpecification,
            POI_LAYER,
            POI_SOURCE,
          ),
        )
      }
    },

    onMapInit(map: maplibregl.Map) {
      this.map = map
      this.$emit('mapInit', map)
    },

    onMapStyleLoad(style: maplibregl.StyleSpecification) {
      this.poiLayerTemplate = style.layers.find(
        layer => layer.id === 'poi-level-1',
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
        }
        else {
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

        const firstSymbolLayerId: string | undefined = this.map
          .getStyle()
          .layers.find(layer => layer.type === 'line')?.id
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
          firstSymbolLayerId,
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
          firstSymbolLayerId,
        )
      }

      this.$emit('mapStyleLoad', style)
    },

    onMapRender(
      eventName:
        | 'mapData'
        | 'mapDragEnd'
        | 'mapMoveEnd'
        | 'mapResize'
        | 'mapRotateEnd'
        | 'mapTouchMove'
        | 'mapZoomEnd',
      event: any,
    ) {
      if (
        this.map
        && this.map.getSource(POI_SOURCE)
        && this.map.isSourceLoaded(POI_SOURCE)
      ) {
        this.markers = updateMarkers(
          this.map as maplibregl.Map,
          this.markers,
          POI_SOURCE,
          this.fitBounds,
          (feature: ApiPoi, marker?: Marker) => this.$emit('featureClick', feature, marker),
        )
      }

      // @ts-expect-error: eventName is not in events definition
      this.$emit(eventName, event)
    },
  },
})
</script>

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
      @map-data="onMapRender('mapData', $event)"
      @map-drag-end="onMapRender('mapDragEnd', $event)"
      @map-move-end="onMapRender('mapMoveEnd', $event)"
      @map-resize="onMapRender('mapResize', $event)"
      @map-rotate-end="onMapRender('mapRotateEnd', $event)"
      @map-touch-move="onMapRender('mapTouchMove', $event)"
      @map-zoom-end="onMapRender('mapZoomEnd', $event)"
      @map-style-load="onMapStyleLoad($event)"
      @full-attribution="fullAttribution = $event"
    >
      <template #controls>
        <slot name="controls" />
      </template>
      <template #body>
        <slot name="body" />
      </template>
    </Map>
    <Attribution
      v-if="showAttribution && offMapAttribution"
      :attribution="fullAttribution"
    />
  </div>
</template>

<style scoped>
:deep(.cluster-item) {
  cursor: pointer;
}

:deep(.cluster-donut) {
  @apply tw-text-sm tw-leading-none tw-font-medium tw-block tw-text-zinc-800;
}
</style>
