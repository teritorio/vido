<template>
  <div>
    <mapbox
      v-if="mapStyle"
      access-token=""
      :map-options="{
        bounds: bounds,
        center: center,
        hash: 'map',
        maxZoom: defaultZoom.max,
        minZoom: defaultZoom.min,
        pitch,
        style: mapStyle,
        zoom: zoom,
        dragRotate: rotate,
        touchPitch: rotate,
        locale: locale,
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

    <MapControls :map="map" :show-compass="rotate">
      <slot name="controls"></slot>
    </MapControls>

    <slot name="body"></slot>
  </div>
</template>

<script lang="ts">
import Mapbox from 'mapbox-gl-vue'
import { StyleSpecification } from 'maplibre-gl'
import Vue, { PropType } from 'vue'

import MapControls from '@/components/Map/MapControls.vue'
import { DEFAULT_MAP_STYLE, MAP_ZOOM } from '@/lib/constants'
import { fetchStyle } from '@/utils/styles'
import { MapStyleEnum } from '@/utils/types'

export default Vue.extend({
  components: {
    Mapbox,
    MapControls,
  },

  props: {
    mapStyleEnum: {
      type: String as PropType<MapStyleEnum>,
      default: DEFAULT_MAP_STYLE as MapStyleEnum,
    },
    bounds: {
      type: Array, // as PropType<TupleLatLngBounds>,
      default: undefined,
    },
    attributions: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    center: {
      type: [Array, Object], // as PropType<maplibregl.LngLatLike>,
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
  },

  data(): {
    map: maplibregl.Map | null
    mapStyle: StyleSpecification | null
    mapStyleCache: { [key: string]: StyleSpecification }
    locale: Record<string, string>
  } {
    return {
      map: null,
      mapStyle: null,
      mapStyleCache: {},
      locale: {},
    }
  },

  computed: {
    defaultZoom() {
      return MAP_ZOOM.zoom
    },
  },

  watch: {
    mapStyleEnum(value: MapStyleEnum) {
      this.setStyle(value)
    },
  },

  beforeMount() {
    this.setStyle(this.mapStyleEnum)

    this.locale = {
      'NavigationControl.ResetBearing':
        this.$tc('mapControls.resetBearing') || 'Reset bearing to north',
      'NavigationControl.ZoomIn': this.$tc('mapControls.zoomIn') || 'Zoom in',
      'NavigationControl.ZoomOut':
        this.$tc('mapControls.zoomOut') || 'Zoom out',
    }
  },

  methods: {
    onMapInit(map: maplibregl.Map) {
      this.map = map
    },

    setStyle(mapStyleEnum: MapStyleEnum) {
      this.getStyle(mapStyleEnum).then((style) => {
        this.mapStyle = style
        this.map?.setStyle(style)
      })
    },

    async getStyle(mapStyleEnum: MapStyleEnum): Promise<StyleSpecification> {
      if (this.mapStyleCache[mapStyleEnum]) {
        return this.mapStyleCache[mapStyleEnum]
      } else {
        const styleURLs = {
          [MapStyleEnum.vector]: this.$config.VECTO_STYLE_URL,
          [MapStyleEnum.aerial]: this.$config.SATELLITE_STYLE_URL,
          [MapStyleEnum.raster]: this.$config.RASTER_STYLE_URL,
        }
        const style = await fetchStyle(
          styleURLs[mapStyleEnum],
          this.attributions
        )
        this.mapStyleCache[mapStyleEnum] = style
        return style
      }
    },
  },
})
</script>
