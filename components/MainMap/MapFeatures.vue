<template>
  <div class="flex flex-grow">
    <MapBase
      ref="mapBase"
      :features="features"
      :bounds="defaultBounds"
      :fit-bounds-padding-options="fitBoundsPaddingOptions"
      :extra-attributions="extraAttributions"
      :map-style="selectedBackground"
      :rotate="!$screen.touch"
      :show-attribution="!small"
      :off-map-attribution="$screen.smallScreen && !small"
      :hide-control="small"
      :style-icon-filter="styleIconFilter"
      :cooperative-gestures="cooperativeGestures"
      :boundary-area="boundaryArea"
      hash="map"
      @map-init="onMapInit"
      @map-data="onMapRender"
      @map-dragend="onMapRender"
      @map-moveend="onMapRender"
      @map-resize="onMapRender"
      @map-rotateend="onMapRender"
      @map-touchmove="onMapRender"
      @map-zoomend="onMapRender"
      @map-style-load="onMapStyleLoad"
      @feature-click="updateSelectedFeature"
    >
      <template #controls>
        <MapControlsExplore v-if="explorerModeEnabled" :map="map" />
        <MapControls3D :map="map" />
        <MapControlsBackground
          :map="map"
          :backgrounds="availableStyles"
          :initial-background="selectedBackground"
          @change-background="selectedBackground = $event"
        />
      </template>
      <template #body>
        <slot></slot>
      </template>
    </MapBase>
    <SnackBar @click="handleSnackAction" />
    <div
      v-if="isLoadingFeatures"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80"
    >
      <font-awesome-icon
        icon="spinner"
        class="text-zinc-400 animate-spin"
        size="3x"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Polygon, MultiPolygon } from 'geojson'
import debounce from 'lodash.debounce'
import maplibregl, {
  MapDataEvent,
  LngLatBoundsLike,
  MapMouseEvent,
  FitBoundsOptions,
  GeoJSONSource,
} from 'maplibre-gl'
import { mapActions, mapState, mapWritableState } from 'pinia'
import Vue, { PropType, VueConstructor } from 'vue'

import MapControlsExplore from '~/components/MainMap/MapControlsExplore.vue'
import SnackBar from '~/components/MainMap/SnackBar.vue'
import MapBase from '~/components/Map/MapBase.vue'
import MapControls3D from '~/components/Map/MapControls3D.vue'
import MapControlsBackground from '~/components/Map/MapControlsBackground.vue'
import { ApiMenuCategory } from '~/lib/apiMenu'
import { ApiPoi, getPoiById } from '~/lib/apiPois'
import { getBBoxFeatures, getBBoxFeature } from '~/lib/bbox'
import { DEFAULT_MAP_STYLE, MAP_ZOOM } from '~/lib/constants'
import { VectorTilesPoi, vectorTilesPoi2ApiPoi } from '~/lib/vectorTilesPois'
import { mapStore } from '~/stores/map'
import { menuStore } from '~/stores/menu'
import { snackStore } from '~/stores/snack'
import { filterRouteByCategories, filterRouteByPoiIds } from '~/utils/styles'
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

export default (
  Vue as VueConstructor<
    Vue & {
      $refs: {
        mapBase: InstanceType<typeof MapBase>
      }
    }
  >
).extend({
  components: {
    MapBase,
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
      type: Array as PropType<ApiMenuCategory[]>,
      required: true,
    },
    features: {
      type: Array as PropType<ApiPoi[]>,
      default: () => [],
    },
    selectedCategoriesIds: {
      type: Array as PropType<ApiMenuCategory['id'][]>,
      default: () => [],
    },
    styleIconFilter: {
      type: Array as PropType<Array<string[]> | null>,
      default: null,
    },
    explorerModeEnabled: {
      type: Boolean,
      required: true,
    },
    enableFilterRouteByCategories: {
      type: Boolean,
      default: true,
    },
    enableFilterRouteByFeatures: {
      type: Boolean,
      default: false,
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
    markers: { [id: string]: maplibregl.Marker }
    selectedFeatureMarker: maplibregl.Marker | null
    selectedBackground: MapStyleEnum
  } {
    return {
      map: null!,
      markers: {},
      selectedFeatureMarker: null,
      selectedBackground: DEFAULT_MAP_STYLE,
    }
  },

  computed: {
    ...mapState(mapStore, ['selectedFeature']),
    ...mapState(menuStore, ['isLoadingFeatures']),
    ...mapWritableState(mapStore, ['center']),

    availableStyles(): MapStyleEnum[] {
      return [MapStyleEnum.vector, MapStyleEnum.aerial, MapStyleEnum.bicycle]
    },
  },

  watch: {
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
        this.showSelectedFeature()
      }

      this.handleResetMapZoom(
        this.$tc('snack.noPoi.issue'),
        this.$tc('snack.noPoi.action')
      )

      if (this.enableFilterRouteByFeatures) {
        filterRouteByPoiIds(
          this.map,
          this.features.map(
            (feature) =>
              feature.properties?.metadata?.id ||
              feature.id ||
              feature.properties?.id
          )
        )
      }
    },

    selectedFeature() {
      this.showSelectedFeature()
    },

    selectedCategoriesIds(categories) {
      if (this.enableFilterRouteByCategories) {
        filterRouteByCategories(this.map, categories)
      }
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
    this.updateSelectedFeature = debounce(this.updateSelectedFeature, 300)
  },

  beforeMount() {
    const bg = getHashPart(this.$router, 'bg') as keyof typeof MapStyleEnum
    this.selectedBackground = (bg && MapStyleEnum[bg]) || DEFAULT_MAP_STYLE
  },

  methods: {
    ...mapActions(mapStore, ['setSelectedFeature']),
    ...mapActions(snackStore, ['showSnack']),

    // Map and style init and changes

    onMapInit(map: maplibregl.Map) {
      this.map = map

      this.map.on('click', this.onClick)

      this.center = this.map.getCenter()
      this.map.on('moveend', () => {
        this.center = this.map.getCenter()
      })
    },

    onMapStyleLoad(style: maplibregl.StyleSpecification) {
      const colors = [
        ...new Set(
          this.categories
            .filter((category) => category.category)
            .map((category) => category.category.color_fill)
        ),
      ]
      this.$refs.mapBase.initPoiLayer(this.features, colors, [
        'case',
        ['all', ['has', 'display'], ['has', 'color_fill', ['get', 'display']]],
        ['get', 'color_fill', ['get', 'display']],
        '#000000',
      ])

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

    // Map interactions

    onClick(e: MapMouseEvent) {
      let selectedFeatures = STYLE_LAYERS.map((layerId) => {
        return this.map.queryRenderedFeatures(e.point, {
          layers: [layerId],
        }) as unknown as VectorTilesPoi[]
      }).flat()
      selectedFeatures = selectedFeatures.filter(
        (feature) => feature.properties.popup_fields
      )
      if (selectedFeatures.length > 0) {
        // Set temp partial data from vector tiles. Then fetch full data
        this.updateSelectedFeature(
          vectorTilesPoi2ApiPoi(selectedFeatures[0]),
          true
        )
        this.showSelectedFeature()
      } else {
        this.updateSelectedFeature(null)
      }
    },

    updateSelectedFeature(feature: ApiPoi | null, fetch: boolean = false) {
      if (this.selectedFeature !== feature) {
        this.setSelectedFeature(feature)

        if (feature && fetch && feature.properties.metadata.id) {
          try {
            // Seted temp partial data from vector tiles.
            // Now fetch full data.
            return getPoiById(
              this.$vidoConfig().API_ENDPOINT,
              this.$vidoConfig().API_PROJECT,
              this.$vidoConfig().API_THEME,
              feature.properties.metadata.id
            ).then((apiPoi) => {
              // Overide geometry.
              // Keep same original location to avoid side effect on moving selected object.
              apiPoi.geometry = feature.geometry
              this.setSelectedFeature(apiPoi)
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
      // Put selected feature marker on top
      if (this.selectedFeatureMarker) {
        this.selectedFeatureMarker.remove()
        this.selectedFeatureMarker.addTo(this.map)
      }
    },

    goTo(feature: ApiPoi) {
      if (!feature || !('coordinates' in feature.geometry)) {
        return
      }

      this.$refs.mapBase.fitBounds(getBBoxFeature(feature))
    },

    goToSelectedFeature() {
      if (this.selectedFeature?.geometry.type === 'Point') {
        let zoom
        if (this.selectedFeature.properties.vido_zoom) {
          zoom = this.selectedFeature.properties.vido_zoom
        } else if (this.selectedFeature.properties.vido_cat) {
          zoom =
            this.categories.find((category) => category.id == this.selectedFeature?.properties.vido_cat)?.category
              .zoom || 17
        }
        this.map.flyTo({
          center: this.selectedFeature.geometry
            .coordinates as unknown as LatLng,
          zoom: zoom === undefined ? Math.max(this.map.getZoom(), 17) : zoom,
        })
      }
    },

    // Other

    showZoomSnack(text: string, textBtn: string) {
      this.showSnack({
        time: 5000,
        text,
        textBtn,
      })
    },

    handleSnackAction() {
      this.showSnack(null)

      this.resetZoom()
      if (this.features) {
        const bounds = getBBoxFeatures(this.features)
        if (bounds) {
          this.$refs.mapBase.fitBounds(bounds)
        }
      }
    },

    resetZoom() {
      this.$refs.mapBase.fitBounds(this.defaultBounds, { linear: false })
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
        filterRouteByPoiIds(this.map, [
          this.selectedFeature.properties?.metadata?.id ||
            this.selectedFeature?.id ||
            this.selectedFeature?.properties?.id,
        ])

        if (
          ['Point', 'MultiLineString', 'LineString'].includes(
            this.selectedFeature.geometry.type
          )
        ) {
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
              : this.selectedFeature.geometry.type === 'Point'
              ? this.selectedFeature.geometry?.coordinates
              : this.defaultBounds
          ) as [number, number]

          this.selectedFeatureMarker = new maplibregl.Marker({
            scale: 1.3,
            color: '#f44336',
          })
            .setLngLat(lngLat)
            .addTo(this.map)
        }
      } else {
        if (this.enableFilterRouteByCategories) {
          filterRouteByPoiIds(
            this.map,
            this.features.map(
              (feature) =>
                feature.properties?.metadata?.id ||
                feature.id ||
                feature.properties?.id
            )
          )
        }
        if (this.enableFilterRouteByCategories) {
          filterRouteByCategories(this.map, this.selectedCategoriesIds)
        }
      }
    },
  },
})
</script>
