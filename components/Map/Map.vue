<template>
  <div>
    <mapbox
      v-if="mapStyle"
      access-token=""
      :map-options="{
        bounds: default_bounds,
        hash: 'map',
        maxZoom: zoom.max,
        minZoom: zoom.min,
        pitch,
        style: mapStyle,
        zoom: zoom.default,
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

    <MapControls :map="map">
      <slot name="controls"></slot>
    </MapControls>

    <slot name="body"></slot>
  </div>
</template>

<script lang="ts">
import Mapbox from 'mapbox-gl-vue'
import { StyleSpecification } from 'maplibre-gl'
import Vue, { PropType } from 'vue'
import { mapGetters } from 'vuex'

import MapControls from '@/components/MapControls.vue'
import { DEFAULT_MAP_STYLE } from '@/lib/constants'
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
    attributions: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    pitch: {
      type: Number,
      default: 0,
    },
  },

  data(): {
    map: maplibregl.Map | null
    mapStyle: StyleSpecification | null
    locale: Record<string, string>
  } {
    return {
      map: null,
      mapStyle: null,
      locale: {},
    }
  },

  computed: {
    ...mapGetters({
      default_bounds: 'map/default_bounds',
      zoom: 'map/zoom',
    }),
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
      const styleURLs = {
        [MapStyleEnum.vector]: this.$config.VECTO_STYLE_URL,
        [MapStyleEnum.aerial]: this.$config.SATELLITE_STYLE_URL,
        [MapStyleEnum.raster]: this.$config.RASTER_STYLE_URL,
      }
      fetchStyle(styleURLs[mapStyleEnum], this.attributions).then((style) => {
        this.mapStyle = style
        this.map?.setStyle(style)
      })
    },
  },
})
</script>
