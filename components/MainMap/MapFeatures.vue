<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { MultiPolygon, Polygon } from 'geojson'
import debounce from 'lodash.debounce'
import type {
  FitBoundsOptions,
  GeoJSONSource,
  LngLatBounds,
  Map,
  MapDataEvent,
  MapGeoJSONFeature,
  MapMouseEvent,
  Marker,
} from 'maplibre-gl'
import { mapActions, mapState, storeToRefs } from 'pinia'
import type { PropType } from 'vue'
import { ref } from 'vue'
import booleanIntersects from '@turf/boolean-intersects'

import { TeritorioCluster } from '@teritorio/maplibre-gl-teritorio-cluster'
import { defineNuxtComponent } from '#app'
import MapControlsExplore from '~/components/MainMap/MapControlsExplore.vue'
import SnackBar from '~/components/MainMap/SnackBar.vue'
import MapBase from '~/components/Map/MapBase.vue'
import MapControls3D from '~/components/Map/MapControls3D.vue'
import MapControlsBackground from '~/components/Map/MapControlsBackground.vue'
import type { ApiMenuCategory } from '~/lib/apiMenu'
import type { ApiPoi } from '~/lib/apiPois'
import { getPoiById } from '~/lib/apiPois'
import { getBBoxFeature, getBBoxFeatures } from '~/lib/bbox'
import { DEFAULT_MAP_STYLE, MAP_ZOOM } from '~/lib/constants'
import type { VectorTilesPoi } from '~/lib/vectorTilesPois'
import { vectorTilesPoi2ApiPoi } from '~/lib/vectorTilesPois'
import { mapStore as useMapStore } from '~/stores/map'
import { menuStore } from '~/stores/menu'
import { siteStore as useSiteStore } from '~/stores/site'
import { snackStore } from '~/stores/snack'
import { filterRouteByCategories, filterRouteByPoiIds } from '~/utils/styles'
import type { LatLng } from '~/utils/types'
import { MapStyleEnum } from '~/utils/types'
import { getHashPart } from '~/utils/url'
import useDevice from '~/composables/useDevice'
import { clusterRender, markerRender, pinMarkerRender } from '~/lib/clusters'

const STYLE_LAYERS = [
  'poi-level-1',
  'poi-level-2',
  'poi-level-3',
  'features-line',
  'features-fill',
]
const POI_SOURCE = 'poi'

export default defineNuxtComponent({
  components: {
    FontAwesomeIcon,
    MapBase,
    MapControlsExplore,
    MapControls3D,
    MapControlsBackground,
    SnackBar,
  },

  props: {
    defaultBounds: {
      type: [Array, Object] as PropType<LngLatBounds>,
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

  created() {
    this.updateSelectedFeature = debounce(this.updateSelectedFeature, 300)
  },

  setup() {
    const device = useDevice()
    const { config } = storeToRefs(useSiteStore())
    const mapStore = useMapStore()
    const { center, selectedFeature, pinMarker, teritorioCluster } = storeToRefs(mapStore)
    const mapStyleLoaded = ref(false)

    return {
      center,
      config,
      device,
      mapBase: ref<InstanceType<typeof MapBase>>(),
      mapStore,
      mapStyleLoaded,
      pinMarker,
      selectedFeature,
      teritorioCluster,
    }
  },

  data(): {
    map: Map
    markers: { [id: string]: Marker }
    selectedBackground: MapStyleEnum
  } {
    return {
      map: null!,
      markers: {},
      selectedBackground: DEFAULT_MAP_STYLE,
    }
  },

  computed: {
    ...mapState(menuStore, ['isLoadingFeatures']),

    availableStyles(): MapStyleEnum[] {
      const styles = [MapStyleEnum.vector, MapStyleEnum.aerial]

      if (this.config!.BICYCLE_STYLE_URL)
        styles.push(MapStyleEnum.bicycle)

      return styles
    },

    // Workaround typing issue
    mapTyped(): Map {
      return this.map as Map
    },
  },

  watch: {
    features() {
      if (!this.map)
        return

      // Change visible data
      const source = this.map.getSource(POI_SOURCE)
      if (source?.type === 'geojson' && 'setData' in source) {
        (source as GeoJSONSource).setData({
          type: 'FeatureCollection',
          features: this.mapBase!.featuresPrepare(this.features),
        })
        this.showSelectedFeature()
      }

      this.handleResetMapZoom(
        this.$t('snack.noPoi.issue'),
        this.$t('snack.noPoi.action'),
      )

      if (this.enableFilterRouteByFeatures) {
        filterRouteByPoiIds(
          this.map as Map,
          this.features.map(
            feature =>
              feature.properties?.metadata?.id
              || feature.id
              || feature.properties?.id,
          ),
        )
      }
    },

    selectedFeature() {
      if (this.pinMarker)
        this.pinMarker.addTo(this.map as Map)

      this.showSelectedFeature()
    },

    selectedCategoriesIds(categories) {
      if (this.enableFilterRouteByCategories)
        filterRouteByCategories(this.map as Map, categories)
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

  beforeMount() {
    const bg = getHashPart(this.$router, 'bg') as keyof typeof MapStyleEnum
    this.selectedBackground = (bg && MapStyleEnum[bg]) || DEFAULT_MAP_STYLE
  },

  methods: {
    ...mapActions(snackStore, ['showSnack']),

    // Map and style init and changes

    onMapInit(map: Map) {
      this.map = map

      this.teritorioCluster = new TeritorioCluster(map, POI_SOURCE, {
        clusterRenderFn: clusterRender,
        initialFeature: this.selectedFeature as unknown as MapGeoJSONFeature,
        markerRenderFn: markerRender,
        markerSize: 32,
        pinMarkerRenderFn: pinMarkerRender,
      })

      this.teritorioCluster.addEventListener('click', (e: Event) => this.updateSelectedFeature((e as CustomEvent).detail.selectedFeature))

      this.map.on('click', this.onClick)

      this.center = this.map.getCenter()
      this.map.on('moveend', () => {
        this.center = this.map.getCenter()
      })
    },

    onMapStyleLoad() {
      const colors = [
        ...new Set(
          this.categories
            .filter(category => category.category)
            .map(category => category.category.color_fill),
        ),
      ]
      this.mapBase!.initPoiLayer(this.features, colors, [
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
      this.mapStyleLoaded = true
    },

    // Map interactions
    onClick(e: MapMouseEvent) {
      let selectedFeatures = STYLE_LAYERS.map((layerId) => {
        return this.map.queryRenderedFeatures(e.point, {
          layers: [layerId],
        }) as unknown as VectorTilesPoi[]
      }).flat()

      selectedFeatures = selectedFeatures.filter(
        feature => feature.properties.popup_fields,
      )

      if (selectedFeatures.length > 0) {
        // Set temp partial data from vector tiles. Then fetch full data
        this.updateSelectedFeature(vectorTilesPoi2ApiPoi(selectedFeatures[0]), true)
        this.showSelectedFeature()
      }
    },

    updateSelectedFeature(feature: ApiPoi | null, fetch = false) {
      if (this.selectedFeature !== feature) {
        this.mapStore.setSelectedFeature(feature)

        if (feature && fetch && feature.properties.metadata.id) {
          try {
            // Seted temp partial data from vector tiles.
            // Now fetch full data.
            return getPoiById(
              this.config!,
              feature.properties.metadata.id,
            ).then((apiPoi) => {
              // Overide geometry.
              // Keep same original location to avoid side effect on moving selected object.
              apiPoi.geometry = feature.geometry
              this.mapStore.setSelectedFeature(apiPoi)
            })
          }
          catch (e) {
            console.error('Vido error:', (e as Error).message)
          }
        }
      }
    },

    goTo(feature: ApiPoi) {
      if (!feature || !('coordinates' in feature.geometry))
        return

      this.mapBase!.fitBounds(getBBoxFeature(feature))
    },

    goToSelectedFeature() {
      if (this.selectedFeature?.geometry.type === 'Point') {
        let zoom
        if (this.selectedFeature.properties.vido_zoom) {
          zoom = this.selectedFeature.properties.vido_zoom
        }
        else if (this.selectedFeature.properties.vido_cat) {
          zoom
            = this.categories.find(
              category =>
                category.id === this.selectedFeature?.properties.vido_cat,
            )?.category.zoom || 17
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
        if (bounds)
          this.mapBase!.fitBounds(bounds)
      }
    },

    resetZoom() {
      this.mapBase!.fitBounds(this.defaultBounds, { linear: false })
    },

    handleResetMapZoom(text: string, textBtn: string) {
      const mapBound = this.map.getBounds().toArray()
      const bounds = {
        type: 'Polygon',
        coordinates: [[
          [mapBound[0][0], mapBound[0][1]],
          [mapBound[1][0], mapBound[0][1]],
          [mapBound[1][0], mapBound[1][1]],
          [mapBound[0][0], mapBound[1][1]],
          [mapBound[0][0], mapBound[0][1]],
        ]],
      } as Polygon
      const isOneInView = this.features.some(feature => booleanIntersects(bounds, feature.geometry as Exclude<GeoJSON.Geometry, GeoJSON.GeometryCollection>))

      const currentZoom = this.map.getZoom()

      if (
        !isOneInView
        && currentZoom >= MAP_ZOOM.zoom.default
        && this.features.length > 0
      ) {
        this.showZoomSnack(text, textBtn)
      }

      if (currentZoom < MAP_ZOOM.zoom.default)
        this.resetZoom()
    },

    showSelectedFeature() {
      if (
        this.selectedFeature
        && (this.selectedFeature.properties?.metadata?.id
        || this.selectedFeature?.id
        || this.selectedFeature?.properties?.id)
      ) {
        filterRouteByPoiIds(this.map as Map, [
          this.selectedFeature.properties?.metadata?.id
          || this.selectedFeature?.id
          || this.selectedFeature?.properties?.id,
        ])
      }
      else {
        if (this.enableFilterRouteByFeatures) {
          filterRouteByPoiIds(
            this.map as Map,
            this.features.map(
              feature =>
                feature.properties?.metadata?.id
                || feature.id
                || feature.properties?.id,
            ),
          )
        }

        if (this.enableFilterRouteByCategories)
          filterRouteByCategories(this.map as Map, this.selectedCategoriesIds)
      }
    },
  },
})
</script>

<template>
  <div class="tw-flex tw-flex-grow">
    <MapBase
      ref="mapBase" :features="features" :bounds="defaultBounds"
      :fit-bounds-padding-options="fitBoundsPaddingOptions" :extra-attributions="extraAttributions"
      :map-style="selectedBackground" :rotate="!device.touch" :show-attribution="!small"
      :off-map-attribution="device.smallScreen && !small" :hide-control="small" :style-icon-filter="styleIconFilter"
      :cooperative-gestures="cooperativeGestures" :boundary-area="boundaryArea" hash="map" @map-init="onMapInit"
      @map-style-load="onMapStyleLoad" @feature-click="updateSelectedFeature"
    >
      <template #controls>
        <MapControlsExplore v-if="explorerModeEnabled" :map="mapTyped" />
        <MapControls3D :map="mapTyped" />
        <MapControlsBackground
          :map="mapTyped" :backgrounds="availableStyles" :initial-background="selectedBackground"
          @change-background="selectedBackground = $event"
        />
      </template>
      <template #body>
        <slot />
      </template>
    </MapBase>
    <SnackBar @click="handleSnackAction" />
    <div
      v-if="isLoadingFeatures"
      class="tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-bg-black tw-bg-opacity-80"
    >
      <FontAwesomeIcon icon="spinner" class="tw-text-zinc-400 tw-animate-spin" size="3x" />
    </div>
  </div>
</template>
