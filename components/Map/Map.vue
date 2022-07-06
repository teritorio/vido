<template>
  <div>
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
        pitch,
        style: style,
        zoom: zoom,
        locale: locales,
        attributionControl: false,
      }"
      :nav-control="{
        show: false,
      }"
      v-bind="$attrs"
      @map-init="$emit('map-init', $event) && onMapInit($event)"
      @map-pitchend="$emit('map-pitchend', $event)"
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
      :class="hideControl && 'hidden'"
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
} from 'maplibre-gl'
import Vue, { PropType } from 'vue'
import { mapGetters } from 'vuex'

import MapControls from '~/components/Map/MapControls.vue'
import { DEFAULT_MAP_STYLE, MAP_ZOOM } from '~/lib/constants'
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
    pitch: {
      type: Number,
      default: 0,
    },
    rotate: {
      type: Boolean,
      default: false,
    },
    hash: {
      type: String,
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
    ...mapGetters({
      locale: 'site/locale',
    }),
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
      this.map = map
      this.languageControl = new OpenMapTilesLanguage({
        defaultLanguage: this.locale,
      })

      if (this.showAttribution) {
        this.addAttribution()
      }
      this.map.addControl(this.languageControl)

      if (!this.rotate) {
        this.map.dragRotate.disable()
        this.map.touchZoomRotate.disableRotation()
      }
    },

    setStyle(mapStyle: MapStyleEnum) {
      this.getStyle(mapStyle)
        .then((style) => {
          const vectorSource = Object.values(style.sources).find(
            (source) => ['vector', 'raster'].lastIndexOf(source.type) >= 0
          ) as VectorSourceSpecification | RasterSourceSpecification
          if (vectorSource) {
            this.$emit('full-attribution', vectorSource.attribution)
          }

          this.$emit('map-style-load', style)
          this.style = style
          this.map?.setStyle(style)
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.error('Vido error:', e.message)
        })
    },

    async getStyle(mapStyle: MapStyleEnum): Promise<StyleSpecification> {
      if (this.mapStyleCache[mapStyle]) {
        return this.mapStyleCache[mapStyle]
      } else {
        const styleURLs = {
          [MapStyleEnum.vector]: this.$vidoConfig.VECTO_STYLE_URL,
          [MapStyleEnum.aerial]: this.$vidoConfig.SATELLITE_STYLE_URL,
          [MapStyleEnum.bicycle]: this.$vidoConfig.BICYCLE_STYLE_URL,
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
.mapboxgl-ctrl.mapboxgl-ctrl-attrib {
  @apply text-xs px-1 py-0.5 rounded-tl-sm;
}

.mapboxgl-ctrl.mapboxgl-ctrl-attrib.mapboxgl-compact {
  min-height: 24px;

  @apply pl-2 pr-8 py-1 rounded-sm;
}

.mapboxgl-ctrl.mapboxgl-ctrl-attrib.mapboxgl-compact:not(.mapboxgl-compact-show) {
  @apply bg-transparent;
}

.mapboxgl-ctrl.mapboxgl-ctrl-attrib.mapboxgl-compact.mapboxgl-compact-show
  .mapboxgl-ctrl-attrib-button {
  @apply bg-transparent;
}

.maplibregl-ctrl-attrib {
  margin-left: 100px;
}
</style>
