<script lang="ts">
import { OpenMapTilesLanguage } from '@teritorio/openmaptiles-gl-language'
import type {
  FitBoundsOptions,
  LngLatBoundsLike,
  LngLatLike,
  MapDataEvent,
  MapLibreEvent,
  MapTouchEvent,
  RasterSourceSpecification,
  StyleSpecification,
  VectorSourceSpecification,
} from 'maplibre-gl'
import {
  AttributionControl,
  FullscreenControl,
  GeolocateControl,
  Map,
  NavigationControl,
  ScaleControl,
} from 'maplibre-gl'
import { mapState } from 'pinia'
import type { PropType } from 'vue'

import { defineNuxtComponent, useRequestHeaders } from '#app'
import { DEFAULT_MAP_STYLE, MAP_ZOOM } from '~/lib/constants'
import { siteStore } from '~/stores/site'
import { fetchStyle } from '~/utils/styles'
import { MapStyleEnum } from '~/utils/types'

type ITMap = InstanceType<typeof Map>
type ITAttributionControl = InstanceType<typeof AttributionControl>
type ITFullscreenControl = InstanceType<typeof FullscreenControl>

export default defineNuxtComponent({
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
    map: ITMap | undefined
    style: StyleSpecification | null
    mapStyleCache: { [key: string]: StyleSpecification }
    attributionControl: ITAttributionControl | null
    languageControl: OpenMapTilesLanguage | null
    fullscreenControlObject: ITFullscreenControl | undefined
    withMap: any[]
  } {
    return {
      map: undefined,
      style: null,
      mapStyleCache: {},
      attributionControl: null,
      languageControl: null,
      fullscreenControlObject: undefined,
      withMap: [],
    }
  },

  mounted() {
    // @ts-expect-error: Instance is too deep
    this.fullscreenControlObject = new FullscreenControl({})

    const map = new Map({
      container: 'map',
      style: (this.style as StyleSpecification) || {
        version: 8,
        sources: {},
        layers: [
          {
            id: 'bg',
            type: 'background',
            paint: { 'background-color': '#f8f4f0' },
          },
        ],
      },
      center: this.center,
      zoom: this.zoom,
      bounds: this.bounds,
      fitBoundsOptions: this.fitBoundsOptions,
      hash: this.hash,
      maxZoom: this.defaultZoom.max,
      minZoom: this.defaultZoom.min,
      // style: this.style,
      attributionControl: false,
      cooperativeGestures: this.cooperativeGestures,
      locale: {
        'NavigationControl.ResetBearing':
          this.$t('mapControls.resetBearing') || 'Reset bearing to north',
        'NavigationControl.ZoomIn': this.$t('mapControls.zoomIn') || 'Zoom in',
        'NavigationControl.ZoomOut':
          this.$t('mapControls.zoomOut') || 'Zoom out',
      },
    })

    map.on('load', _event => this.onMapInit(map as ITMap))
    map.on('data', $event => this.$emit('map-data', $event))
    map.on('dragend', $event => this.$emit('map-dragend', $event))
    map.on('moveend', $event => this.$emit('map-moveend', $event))
    map.on('resize', $event => this.$emit('map-resize', $event))
    map.on('rotateend', $event => this.$emit('map-rotateend', $event))
    map.on('touchmove', $event => this.$emit('map-touchmove', $event))
    map.on('zoomend', $event => this.$emit('map-zoomend', $event))

    map.addControl(
      new NavigationControl({
        showZoom: true,
        showCompass: this.rotate,
        visualizePitch: true,
      }),
    )

    const geolocateControl = new GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
    })
    map.addControl(geolocateControl)
    geolocateControl._container.classList.add('control-geolocate')

    if (this.fullscreenControl)
      map.addControl(this.fullscreenControlObject)

    map.addControl(
      new ScaleControl({
        maxWidth: 80,
      }),
    )
  },

  emits: {
    'map-init': (_map: ITMap) => true,
    'map-data': (_event: MapDataEvent & object) => true,
    'map-dragend': (
      _event: MapLibreEvent<MouseEvent | TouchEvent | undefined> & object,
    ) => true,
    'map-moveend': (
      _event: MapLibreEvent<MouseEvent | TouchEvent | WheelEvent | undefined> &
      object,
    ) => true,
    'map-resize': (_event: MapLibreEvent<unknown> & object) => true,
    'map-rotateend': (
      _event: MapLibreEvent<MouseEvent | TouchEvent | undefined> & object,
    ) => true,
    'map-touchmove': (_event: MapTouchEvent & object) => true,
    'map-zoomend': (
      _event: MapLibreEvent<MouseEvent | TouchEvent | WheelEvent | undefined> &
      object,
    ) => true,
    'full-attribution': (_attribution: string) => true,
    'map-style-load': (_style: StyleSpecification) => true,
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
      if (enable)
        this.addAttribution()
      else
        this.removeAttribution()
    },
    locale(locale: string) {
      this.setLanguage(locale)
    },
    bounds() {
      if (this.bounds)
        this.map?.fitBounds(this.bounds, this.fitBoundsOptions)
    },
  },

  beforeMount() {
    this.setStyle(this.mapStyle)
  },

  methods: {
    doWithMap(lambda: () => void) {
      if (this.map)
        lambda()
      else
        this.withMap.push(lambda)
    },

    onMapInit(map: ITMap) {
      this.$emit('map-init', map)

      this.map = map
      this.languageControl = new OpenMapTilesLanguage({
        defaultLanguage: this.locale || undefined,
      })

      if (this.showAttribution)
        this.addAttribution()

      this.map.addControl(this.languageControl)

      if (!this.rotate) {
        this.map.dragRotate.disable()
        this.map.touchZoomRotate.disableRotation()
      }

      new ResizeObserver((_entries) => {
        this.map?.resize()
      }).observe(document.getElementById('map')!)

      while (this.withMap.length > 0)
        this.withMap.pop()()
    },

    setStyle(mapStyle: MapStyleEnum) {
      this.getStyle(mapStyle)
        .then((style) => {
          const vectorSource = Object.values(style.sources || []).find(
            source => ['vector', 'raster'].lastIndexOf(source.type) >= 0,
          ) as VectorSourceSpecification | RasterSourceSpecification | undefined
          if (vectorSource?.attribution)
            this.$emit('full-attribution', vectorSource.attribution)

          this.style = style
          this.doWithMap(() => {
            // Use no diff mode to avoid issue with added layers
            this.map!.setStyle(style, { diff: false })
            this.emitStyleLoad()
          })
        })
        .catch((e) => {
          console.error('Vido error:', (e as Error).message)
        })
    },

    emitStyleLoad() {
      if (this.map) {
        const styleEvent = (e: MapDataEvent) => {
          if (this.map && e.dataType === 'style' && this.style) {
            this.map.off('styledata', styleEvent)
            this.$emit('map-style-load', this.style as StyleSpecification)
          }
        }
        this.map.on('styledata', styleEvent)
      }
    },

    async getStyle(mapStyle: MapStyleEnum): Promise<StyleSpecification> {
      if (this.mapStyleCache[mapStyle]) {
        return this.mapStyleCache[mapStyle]
      }
      else {
        const config = this.$vidoConfig(useRequestHeaders())
        const styleURLs = {
          [MapStyleEnum.vector]: config.VECTO_STYLE_URL,
          [MapStyleEnum.aerial]: config.SATELLITE_STYLE_URL,
          [MapStyleEnum.bicycle]: config.BICYCLE_STYLE_URL,
        }
        const style = await fetchStyle(
          styleURLs[mapStyle],
          this.extraAttributions,
        )
        this.mapStyleCache[mapStyle] = style

        return style
      }
    },

    addAttribution() {
      this.doWithMap(() => {
        if (!this.attributionControl) {
          this.attributionControl = new AttributionControl()
          this.map!.addControl(this.attributionControl)
        }
      })
    },

    removeAttribution() {
      this.doWithMap(() => {
        if (this.attributionControl) {
          this.map!.removeControl(this.attributionControl)
          this.attributionControl = null
        }
      })
    },

    setLanguage(locale: string) {
      this.languageControl?.setLanguage(locale)
    },
  },
})
</script>

<template>
  <div :class="(hideControl || !map) && 'map-controls-hidden'">
    <div id="map" />
    <slot name="controls" />
    <slot name="body" />
  </div>
</template>

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

<style lang="scss">
#map .maplibregl-ctrl-group {
  @apply tw-mt-2 tw-mb-2;

  background: none;
}

#map .maplibregl-ctrl-group:not(:empty) {
  box-shadow: none;
}

#map .maplibregl-ctrl-group > button,
#map .maplibregl-ctrl-group > button:not(:disabled) {
  border: none;
  @apply tw-text-sm tw-font-bold tw-text-zinc-800 tw-bg-white tw-rounded-full tw-shadow-md tw-outline-none tw-w-11 tw-h-11;
  @apply focus:tw-rounded-full focus:tw-shadow-md focus:tw-outline-none focus-visible:tw-bg-zinc-100;
  @apply hover:tw-bg-zinc-100;
}

#map .maplibregl-ctrl-group > button.maplibregl-ctrl-active,
#map .maplibregl-ctrl-group > button.maplibregl-ctrl-active:not(:disabled) {
  @apply tw-bg-blue-500 tw-text-white hover:tw-bg-blue-400 focus-visible:tw-bg-blue-400;
}

#map .maplibregl-ctrl-top-right {
  @apply tw-flex tw-flex-col tw-justify-center tw-inset-y-3;
}

#map .maplibregl-ctrl-attrib {
  font-size: 0.75rem;
  line-height: 1rem;
}

.control-geolocate {
  @apply md:tw-hidden;
}
</style>
