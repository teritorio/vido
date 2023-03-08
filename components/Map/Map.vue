<template>
  <div :class="(hideControl || !map) && 'map-controls-hidden'">
    <mapbox
      v-if="style"
      access-token=""
      :map-options="{
        bounds: bounds,
        fitBoundsOptions: fitBoundsOptions,
        center: center,
        hash: hash,
        maxZoom: defaultZoom.max,
        minZoom: defaultZoom.min,
        style: style,
        zoom: zoom,
        locale: locales,
        attributionControl: false,
        cooperativeGestures: cooperativeGestures,
      }"
      :nav-control="{
        show: false,
      }"
      v-bind="$attrs"
      @map-init="onMapInit($event)"
      @map-data="$emit('map-data', $event)"
      @map-dragend="$emit('map-dragend', $event)"
      @map-moveend="$emit('map-moveend', $event)"
      @map-resize="$emit('map-resize', $event)"
      @map-rotateend="$emit('map-rotateend', $event)"
      @map-touchmove="$emit('map-touchmove', $event)"
      @map-zoomend="$emit('map-zoomend', $event)"
    />

    <MapControls
      :map="map"
      :show-compass="rotate"
      :fullscreen-control="fullscreenControl"
    >
      <slot name="controls"></slot>
    </MapControls>

    <slot name="body"></slot>
  </div>
</template>

<script lang="ts">
import { OpenMapTilesLanguage } from '@teritorio/openmaptiles-gl-language'
import Mapbox from 'mapbox-gl-vue'
import {
  Map,
  RasterSourceSpecification,
  VectorSourceSpecification,
  StyleSpecification,
  LngLatBoundsLike,
  LngLatLike,
  AttributionControl,
  FitBoundsOptions,
  MapDataEvent,
} from 'maplibre-gl'
import { mapState } from 'pinia'
import Vue, { PropType } from 'vue'

import MapControls from '~/components/Map/MapControls.vue'
import { DEFAULT_MAP_STYLE, MAP_ZOOM } from '~/lib/constants'
import { siteStore } from '~/stores/site'
import { fetchStyle } from '~/utils/styles'
import { MapStyleEnum } from '~/utils/types'

export default Vue.extend({
  components: {
    Mapbox,
    MapControls,
  },

  props: {
    mapStyle: {
      type: String as PropType<MapStyleEnum>,
      default: DEFAULT_MAP_STYLE as MapStyleEnum,
    },
    bounds: {
      type: [Array, Object] as PropType<LngLatBoundsLike>,
      default: undefined,
    },
    fitBoundsOptions: {
      type: Object as PropType<FitBoundsOptions>,
      default: () => ({
        padding: 50,
        maxZoom: 17,
      }),
    },
    extraAttributions: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    center: {
      type: [Array, Object] as PropType<LngLatLike>,
      default: undefined,
    },
    zoom: {
      type: Number,
      default: null,
    },
    rotate: {
      type: Boolean,
      default: false,
    },
    fullscreenControl: {
      type: Boolean,
      default: false,
    },
    hash: {
      type: String as PropType<string>,
      default: undefined,
    },
    showAttribution: {
      type: Boolean,
      default: true,
    },
    hideControl: {
      type: Boolean,
      default: false,
    },
    cooperativeGestures: {
      type: Boolean,
      default: false,
    },
  },

  data(): {
    map: Map | null
    style: StyleSpecification | null
    mapStyleCache: { [key: string]: StyleSpecification }
    attributionControl: AttributionControl | null
    locales: Record<string, string>
    languageControl: OpenMapTilesLanguage | null
  } {
    return {
      map: null,
      style: null,
      mapStyleCache: {},
      attributionControl: null,
      locales: {},
      languageControl: null,
    }
  },

  computed: {
    ...mapState(siteStore, ['locale']),

    defaultZoom() {
      return MAP_ZOOM.zoom
    },
  },

  watch: {
    mapStyle(value: MapStyleEnum) {
      this.setStyle(value)
    },
    showAttribution(enable: boolean) {
      if (enable) {
        this.addAttribution()
      } else {
        this.removeAttribution()
      }
    },
    locale(locale: string) {
      this.setLanguage(locale)
    },
    bounds() {
      if (this.bounds) {
        this.map?.fitBounds(this.bounds, this.fitBoundsOptions)
      }
    },
  },

  beforeMount() {
    this.setStyle(this.mapStyle)

    this.locales = {
      'NavigationControl.ResetBearing':
        this.$tc('mapControls.resetBearing') || 'Reset bearing to north',
      'NavigationControl.ZoomIn': this.$tc('mapControls.zoomIn') || 'Zoom in',
      'NavigationControl.ZoomOut':
        this.$tc('mapControls.zoomOut') || 'Zoom out',
    }
  },

  methods: {
    onMapInit(map: Map) {
      this.$emit('map-init', map)

      this.map = map
      this.languageControl = new OpenMapTilesLanguage({
        defaultLanguage: this.locale || undefined,
      })

      if (this.showAttribution) {
        this.addAttribution()
      }
      this.map.addControl(this.languageControl)

      if (!this.rotate) {
        this.map.dragRotate.disable()
        this.map.touchZoomRotate.disableRotation()
      }

      this.emitStyleLoad()
    },

    setStyle(mapStyle: MapStyleEnum) {
      this.getStyle(mapStyle)
        .then((style) => {
          const vectorSource = Object.values(style.sources || []).find(
            (source) => ['vector', 'raster'].lastIndexOf(source.type) >= 0
          ) as VectorSourceSpecification | RasterSourceSpecification
          if (vectorSource) {
            this.$emit('full-attribution', vectorSource.attribution)
          }

          this.style = style
          if (this.map) {
            // Use no diff mode to avoid issue with added layers
            this.map.setStyle(style, { diff: false })
            this.emitStyleLoad()
          }
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.error('Vido error:', (e as Error).message)
        })
    },

    emitStyleLoad() {
      if (this.map) {
        const styleEvent = (e: MapDataEvent) => {
          if (this.map && e.dataType === 'style') {
            this.map.off('styledata', styleEvent)
            this.$emit('map-style-load', this.style)
          }
        }
        this.map.on('styledata', styleEvent)
      }
    },

    async getStyle(mapStyle: MapStyleEnum): Promise<StyleSpecification> {
      if (this.mapStyleCache[mapStyle]) {
        return this.mapStyleCache[mapStyle]
      } else {
        const styleURLs = {
          [MapStyleEnum.vector]: this.$vidoConfig().VECTO_STYLE_URL,
          [MapStyleEnum.aerial]: this.$vidoConfig().SATELLITE_STYLE_URL,
          [MapStyleEnum.bicycle]: this.$vidoConfig().BICYCLE_STYLE_URL,
        }
        const style = await fetchStyle(
          styleURLs[mapStyle],
          this.extraAttributions
        )
        this.mapStyleCache[mapStyle] = style

        return style
      }
    },

    addAttribution() {
      if (this.map && !this.attributionControl) {
        this.attributionControl = new AttributionControl()
        this.map.addControl(this.attributionControl)
      }
    },

    removeAttribution() {
      if (this.map && this.attributionControl) {
        this.map.removeControl(this.attributionControl)
        this.attributionControl = null
      }
    },

    setLanguage(locale: string) {
      this.languageControl?.setLanguage(locale)
    },
  },
})
</script>

<style>
.map-controls-hidden .mapboxgl-control-container,
.map-controls-hidden .maplibregl-control-container {
  display: none;
}
</style>

<style scoped>
:deep(#map) {
  width: 100%;
  height: 100%;
}
</style>
