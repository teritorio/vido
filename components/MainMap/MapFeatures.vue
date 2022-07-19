<template>
  <div class="w-full h-full">
    <Map
      :bounds="defaultBounds"
      :fit-bounds-options="{
        maxZoom: 17,
        padding: fitBoundsPaddingOptions,
      }"
      :extra-attributions="extraAttributions"
      :map-style="selectedBackground"
      :pitch="pitch"
      :rotate="!$screen.touch"
      :show-attribution="!$screen.smallScreen"
      :hide-control="small"
      hash="map"
      @map-init="onMapInit"
      @map-pitchend="onMapPitchEnd"
      @map-data="onMapRender"
      @map-dragend="onMapRender"
      @map-moveend="onMapRender"
      @map-resize="onMapRender"
      @map-rotateend="onMapRender"
      @map-touchmove="onMapRender"
      @map-zoomend="onMapRender"
      @map-style-load="onMapStyleLoad"
      @full-attribution="$emit('full-attribution', $event)"
    >
      <template #controls>
        <MapControlsExplore />
        <MapControls3D :map="map" :pitch="pitch" />
        <MapControlsBackground
          :backgrounds="availableStyles"
          :initial-background="selectedBackground"
          @change-background="selectedBackground = $event"
        />
      </template>
    </Map>
    <SnackBar @click="handleSnackAction" />
  </div>
</template>

<script lang="ts">
import { PoiFilter } from '@teritorio/map'
import debounce from 'lodash.debounce'
import throttle from 'lodash.throttle'
import maplibregl, {
  MapDataEvent,
  LngLatBoundsLike,
  MapMouseEvent,
  FitBoundsOptions,
  GeoJSONSource,
} from 'maplibre-gl'
import Vue, { PropType } from 'vue'

import MapControlsExplore from '~/components/MainMap/MapControlsExplore.vue'
import SnackBar from '~/components/MainMap/SnackBar.vue'
import Map from '~/components/Map/Map.vue'
import MapControls3D from '~/components/Map/MapControls3D.vue'
import MapControlsBackground from '~/components/Map/MapControlsBackground.vue'
import { ApiMenuCategory } from '~/lib/apiMenu'
import { ApiPoi, getPoiById } from '~/lib/apiPois'
import { getBBoxFeatures, getBBoxFeature } from '~/lib/bbox'
import { DEFAULT_MAP_STYLE, MAP_ZOOM } from '~/lib/constants'
import { MapPoi, mapPoi2ApiPoi } from '~/lib/mapPois'
import { markerLayerTextFactory, updateMarkers } from '~/lib/markerLayerFactory'
import { filterRouteByCategories, filterRouteByPoiId } from '~/utils/styles'
import { LatLng, MapStyleEnum } from '~/utils/types'
import { getHashPart } from '~/utils/url'

const STYLE_LAYERS = [
  'poi-level-1',
  'poi-level-2',
  'poi-level-3',
  'features-line',
  'features-fill',
]
const POI_SOURCE = 'poi'
const POI_LAYER = 'poi'

export default Vue.extend({
  components: {
    Map,
    MapControlsExplore,
    MapControls3D,
    MapControlsBackground,
    SnackBar,
  },

  props: {
    defaultBounds: {
      type: [Array, Object] as PropType<LngLatBoundsLike>,
      default: null,
    },
    fitBoundsPaddingOptions: {
      type: [Number, Object] as PropType<FitBoundsOptions['padding']>,
      default: 50,
    },
    extraAttributions: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    small: {
      type: Boolean,
      default: false,
    },
    categories: {
      type: Object as PropType<Record<ApiMenuCategory['id'], ApiMenuCategory>>,
      required: true,
    },
    features: {
      type: Array as PropType<ApiPoi[]>,
      default: () => [],
    },
    selectedFeature: {
      type: Object as PropType<ApiPoi | null>,
      default: null,
    },
    selectedCategoriesIds: {
      type: Array as PropType<string[]>,
      default: null,
    },
    styleIconFilter: {
      type: Array as PropType<Array<string[]>>,
      default: null,
    },
  },

  data(): {
    map: maplibregl.Map
    poiFilter: PoiFilter | null
    poiLayerTemplate: maplibregl.LayerSpecification | undefined
    pitch: number
    markers: { [id: string]: maplibregl.Marker }
    selectedFeatureMarker: maplibregl.Marker | null
    selectedBackground: keyof typeof MapStyleEnum
  } {
    return {
      map: null!,
      poiFilter: null,
      poiLayerTemplate: undefined,
      pitch: 0,
      markers: {},
      selectedFeatureMarker: null,
      selectedBackground: DEFAULT_MAP_STYLE,
    }
  },

  computed: {
    availableStyles(): MapStyleEnum[] {
      return [MapStyleEnum.vector, MapStyleEnum.aerial, MapStyleEnum.bicycle]
    },
  },

  watch: {
    small() {
      this.resizeMap()
    },

    styleIconFilter() {
      this.setPoiFilter()
    },

    features() {
      if (!this.map) {
        return
      }

      // Change visible data
      const source = this.map.getSource(POI_SOURCE)
      if (source?.type == 'geojson' && 'setData' in source) {
        ;(source as GeoJSONSource).setData({
          type: 'FeatureCollection',
          features: this.features,
        })
      }

      this.handleResetMapZoom(
        this.$tc('snack.noPoi.issue'),
        this.$tc('snack.noPoi.action')
      )
    },

    selectedFeature() {
      this.showSelectedFeature()
    },

    selectedBackground() {
      // Only once map is loaded. Can be called from beforeMount().
      if (this.map) {
        // Re-enable route highlight after style change
        const styledataCallBack = (e: MapDataEvent) => {
          if (e.dataType === 'style') {
            this.map.off('styledata', styledataCallBack)
            this.showSelectedFeature()
          }
        }
        this.map.on('styledata', styledataCallBack)
      }
    },
  },

  created() {
    this.onMapPitchEnd = throttle(this.onMapPitchEnd, 200)
    this.onMapRender = throttle(this.onMapRender, 200, {
      leading: true,
      trailing: true,
    })

    this.updateSelectedFeature = debounce(this.updateSelectedFeature, 300)
  },

  beforeMount() {
    const bg =
      (getHashPart(this.$router, 'bg') as keyof typeof MapStyleEnum) ||
      DEFAULT_MAP_STYLE

    this.selectedBackground = bg
  },

  methods: {
    // Map and style init and changes

    onMapInit(map: maplibregl.Map) {
      this.map = map
      this.pitch = this.map.getPitch()

      this.poiFilter = new PoiFilter()
      this.map.addControl(this.poiFilter)

      this.map.on('styledata', (e: MapDataEvent) => {
        if (e.dataType === 'style') {
          this.onStyleInit()
        }
      })

      this.map.on('click', this.onClick)

      this.$store.dispatch('map/center', this.map.getCenter())
      this.map.on('moveend', () => {
        this.$store.dispatch('map/center', this.map.getCenter())
      })
    },

    onMapStyleLoad(style: maplibregl.StyleSpecification) {
      this.poiLayerTemplate = style.layers.find(
        (layer) => layer.id === 'poi-level-1'
      )
    },

    onStyleInit() {
      this.setPoiFilter()
      this.initPoiLayer(this.features)

      STYLE_LAYERS.forEach((layer) => {
        this.map.on('mouseenter', layer, () => {
          this.map.getCanvas().style.cursor = 'pointer'
        })
        this.map.on('mouseleave', layer, () => {
          this.map.getCanvas().style.cursor = ''
        })
      })
      this.showSelectedFeature()
    },

    initPoiLayer(features: ApiPoi[]) {
      if (!this.map.getSource(POI_SOURCE)) {
        // Create cluster properties, which will contain count of features per category
        const clusterProps: { [category: string]: object } = {}

        Object.keys(this.categories).forEach((category) => {
          clusterProps[category] = [
            '+',
            ['case', ['==', ['get', 'vido_cat'], parseInt(category, 10)], 1, 0],
          ]
        })

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
      }

      // Add individual markers
      if (!this.map.getLayer(POI_LAYER) && this.poiLayerTemplate)
        this.map.addLayer(
          markerLayerTextFactory(this.poiLayerTemplate, POI_LAYER, POI_SOURCE)
        )
    },

    setPoiFilter() {
      if (this.styleIconFilter) {
        this.poiFilter?.setIncludeFilter(this.styleIconFilter)
      } else {
        this.poiFilter?.remove(true)
      }
    },

    // Map interactions

    onClick(e: MapMouseEvent) {
      let selectedFeatures = STYLE_LAYERS.map((layerId) => {
        return this.map.queryRenderedFeatures(e.point, {
          layers: [layerId],
        }) as unknown as MapPoi[]
      }).flat()
      selectedFeatures = selectedFeatures.filter(
        (feature) => feature.properties.popup_properties
      )
      if (selectedFeatures.length > 0) {
        // Set temp partial data from vector tiles. Then fetch full data
        this.updateSelectedFeature(mapPoi2ApiPoi(selectedFeatures[0]), true)
      } else {
        this.updateSelectedFeature(null)
      }
    },

    updateSelectedFeature(feature: ApiPoi | null, fetch: boolean = false) {
      if (this.selectedFeature !== feature) {
        this.$emit('on-select-feature', feature)

        if (feature && fetch && feature.properties.metadata.id) {
          try {
            // Seted temp partial data from vector tiles.
            // Now fetch full data.
            return getPoiById(
              this.$vidoConfig.API_ENDPOINT,
              this.$vidoConfig.API_PROJECT,
              this.$vidoConfig.API_THEME,
              feature.properties.metadata.id
            ).then((apiPoi) => {
              // Overide geometry.
              // Keep same original location to avoid side effect on moving selected object.
              apiPoi.geometry = feature.geometry
              this.$emit('on-select-feature', apiPoi)
            })
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Vido error:', e.message)
          }
        }
      }
    },

    // Map view

    onMapRender() {
      if (
        this.map &&
        this.map.getSource(POI_SOURCE) &&
        this.map.isSourceLoaded(POI_SOURCE)
      ) {
        this.markers = updateMarkers(
          this.map,
          this.categories,
          this.markers,
          POI_SOURCE,
          this.fitBounds,
          this.updateSelectedFeature
        )

        // Put selected feature marker on top
        if (this.selectedFeatureMarker) {
          this.selectedFeatureMarker.remove()
          this.selectedFeatureMarker.addTo(this.map)
        }
      }
    },

    goTo(feature: ApiPoi) {
      if (!feature || !('coordinates' in feature.geometry)) {
        return
      }

      this.fitBounds(getBBoxFeature(feature))
    },

    goToSelectedFeature() {
      if (this.selectedFeature?.geometry.type === 'Point') {
        let zoom
        if (this.selectedFeature.properties.vido_zoom) {
          zoom = this.selectedFeature.properties.vido_zoom
        } else if (this.selectedFeature.properties.vido_cat) {
          zoom =
            this.categories[this.selectedFeature.properties.vido_cat].category
              .zoom
        }
        this.map.flyTo({
          center: this.selectedFeature.geometry
            .coordinates as unknown as LatLng,
          zoom: zoom === undefined ? Math.max(this.map.getZoom(), 17) : zoom,
        })
      }
    },

    // Other

    resizeMap() {
      this.map?.resize()
    },

    onMapPitchEnd(map: maplibregl.Map) {
      this.pitch = map.getPitch()
    },

    showZoomSnack(text: string, textBtn: string) {
      this.$store.dispatch('snack/showSnack', {
        time: 5000,
        text,
        textBtn,
      })
    },

    handleSnackAction() {
      this.$store.dispatch('snack/showSnack')

      this.resetZoom()
      if (this.features) {
        const bounds = getBBoxFeatures(this.features)
        if (bounds) {
          this.fitBounds(bounds)
        }
      }
    },

    resetZoom() {
      this.fitBounds(this.defaultBounds, { linear: false })
    },

    handleResetMapZoom(text: string, textBtn: string) {
      const mapBounds = this.map.getBounds()
      const isOneInView = this.features.some(
        (feature) =>
          feature.geometry.type === 'Point' &&
          mapBounds.contains(feature.geometry.coordinates as [number, number])
      )

      const currentZoom = this.map.getZoom()

      if (
        !isOneInView &&
        currentZoom >= MAP_ZOOM.zoom.default &&
        this.features.length > 0
      ) {
        this.showZoomSnack(text, textBtn)
      }
      if (currentZoom < MAP_ZOOM.zoom.default) {
        this.resetZoom()
      }
    },

    showSelectedFeature() {
      // Clean-up previous marker
      if (this.selectedFeatureMarker) {
        this.selectedFeatureMarker.remove()
        this.selectedFeatureMarker = null
      }

      // Add new marker if a feature is selected
      if (
        this.selectedFeature &&
        (this.selectedFeature.properties?.metadata?.id ||
          this.selectedFeature?.id ||
          this.selectedFeature?.properties?.id)
      ) {
        filterRouteByPoiId(
          this.map,
          this.selectedFeature.properties?.metadata?.id ||
            this.selectedFeature?.id ||
            this.selectedFeature?.properties?.id
        )

        if (this.selectedFeature.geometry.type === 'Point') {
          // Get original coords to set axact marker position
          const originalFeature = this.features.find(
            (originalFeature) =>
              originalFeature.properties?.metadata?.id &&
              this.selectedFeature?.properties?.metadata?.id &&
              originalFeature.properties?.metadata?.id ===
                this.selectedFeature?.properties?.metadata?.id
          )
          const lngLat = (
            originalFeature && originalFeature.geometry.type === 'Point'
              ? originalFeature.geometry.coordinates
              : this.selectedFeature.geometry.coordinates
          ) as [number, number]

          this.selectedFeatureMarker = new maplibregl.Marker({
            scale: 1.3,
            color: '#f44336',
          })
            .setLngLat(lngLat)
            .addTo(this.map)
        }
      } else {
        filterRouteByCategories(this.map, this.selectedCategoriesIds)
      }
    },

    fitBounds(bounds: LngLatBoundsLike, options: FitBoundsOptions = {}) {
      this.map.fitBounds(bounds, {
        maxZoom: 17,
        padding: this.fitBoundsPaddingOptions,
        ...options,
      })
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

<style>
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>
