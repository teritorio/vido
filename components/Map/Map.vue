<template>
  <div :class="(hideControl || !map) && 'map-controls-hidden'">
    <div id="map"></div>
    <MapControls
      v-if="map"
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
import { PropType } from 'vue'

import { defineNuxtComponent, useNuxtApp } from '#app'
import MapControls from '~/components/Map/MapControls.vue'
import { DEFAULT_MAP_STYLE, MAP_ZOOM } from '~/lib/constants'
import { siteStore } from '~/stores/site'
import { fetchStyle } from '~/utils/styles'
import { MapStyleEnum } from '~/utils/types'

export default defineNuxtComponent({
  components: {
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

  mounted() {
    // @ts-ignore
    this.map = new Map({
      container: 'map',
      style: { version: 8, sources: {}, layers: [] },
      center: this.center,
      zoom: this.zoom,
      bounds: this.bounds,
      fitBoundsOptions: this.fitBoundsOptions,
      hash: this.hash,
      maxZoom: this.defaultZoom.max,
      minZoom: this.defaultZoom.min,
      // style: this.style,
      locale: this.locales,
      attributionControl: false,
      cooperativeGestures: this.cooperativeGestures,
    })

    this.map.on('load', ($event) => this.onMapInit(this.map as Map))
    this.map.on('data', ($event) => this.$emit('map-data', $event))
    this.map.on('dragend', ($event) => this.$emit('map-dragend', $event))
    this.map.on('moveend', ($event) => this.$emit('map-moveend', $event))
    this.map.on('resize', ($event) => this.$emit('map-resize', $event))
    this.map.on('rotateend', ($event) => this.$emit('map-rotateend', $event))
    this.map.on('touchmove', ($event) => this.$emit('map-touchmove', $event))
    this.map.on('zoomend', ($event) => this.$emit('map-zoomend', $event))
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
        this.$t('mapControls.resetBearing') || 'Reset bearing to north',
      'NavigationControl.ZoomIn': this.$t('mapControls.zoomIn') || 'Zoom in',
      'NavigationControl.ZoomOut': this.$t('mapControls.zoomOut') || 'Zoom out',
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

      new ResizeObserver((entries) => {
        this.map?.resize()
      }).observe(document.getElementById('map')!)
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
        const { $vidoConfig } = useNuxtApp()
        const styleURLs = {
          [MapStyleEnum.vector]: $vidoConfig().VECTO_STYLE_URL,
          [MapStyleEnum.aerial]: $vidoConfig().SATELLITE_STYLE_URL,
          [MapStyleEnum.bicycle]: $vidoConfig().BICYCLE_STYLE_URL,
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
@import 'maplibre-gl/dist/maplibre-gl.css';

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
