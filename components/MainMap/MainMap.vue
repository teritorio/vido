<template>
  <div class="w-full h-full">
    <div
      :class="[
        'relative flex flex-col w-full h-full sm:h-full',
        !small && 'h-full',
      ]"
    >
      <div
        :class="[
          'flex-grow overflow-hidden',
          !small && isExplorerFavorite && 'sm:mt-20 sm:mt-0 h-4/5 sm:h-full',
        ]"
      >
        <Map
          :bounds="defaultBounds"
          :extra-attributions="extraAttributions"
          :map-style-enum="selectedBackground"
          :pitch="pitch"
          :rotate="true"
          :show-attribution="!$isMobile()"
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
          @full-attribution="$emit('full-attribution', $event)"
        >
          <template #controls>
            <MapControlsExplore />
            <MapControls3D :map="map" :pitch="pitch" />
            <MapControlsBackground
              :backgrounds="availableStyles"
              :initial-background="selectedBackground"
              :hidden="isExplorerFavorite"
              @changeBackground="onClickChangeBackground"
            />
          </template>
        </Map>
      </div>

      <aside v-if="map" class="pointer-events-none">
        <div
          class="absolute flex justify-end pointer-events-auto items-top pt-4 right-3 sm:pt-0 w-40 sm:w-48 top-3"
        >
          <FavoriteMenu
            :has-favorites="favoritesIds.length !== 0"
            :explore-around-selected-poi="exploreAroundSelectedPoi"
            :go-to-selected-poi="goToSelectedPoi"
          />
          <NavMenu class="ml-3 sm:ml-9" />
        </div>
      </aside>

      <div
        class="hidden fixed inset-x-0 bottom-0 sm:flex justify-center overflow-y-auto pointer-events-none h-auto sm:inset-x-3 sm:bottom-3"
      >
        <MapPoiToast
          v-if="selectedFeature && showPoiToast"
          :poi="selectedFeature"
          class="flex-grow-0"
          @explore-click="exploreAroundSelectedPoi"
          @favorite-click="toggleFavoriteMode"
          @zoom-click="goToSelectedPoi"
        />
      </div>

      <div
        v-if="isLoadingFeatures"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80"
      >
        <font-awesome-icon
          icon="spinner"
          class="text-gray-400 animate-spin"
          size="3x"
        />
      </div>
      <FavoritesOverlay v-if="showFavoritesOverlay" />
      <SnackBar @click="handleSnackAction" />
    </div>
  </div>
</template>

<script lang="ts">
import { PoiFilter } from '@teritorio/map'
import { deepEqual } from 'fast-equals'
import GeoJSON from 'geojson'
import throttle from 'lodash.throttle'
import maplibregl, {
  MapLayerMouseEvent,
  MapLayerTouchEvent,
  MapDataEvent,
  LngLatBoundsLike,
} from 'maplibre-gl'
import Vue, { PropType } from 'vue'
import { mapGetters, mapActions } from 'vuex'

import FavoriteMenu from '@/components/MainMap/FavoriteMenu.vue'
import FavoritesOverlay from '@/components/MainMap/FavoritesOverlay.vue'
import MapControlsExplore from '@/components/MainMap/MapControlsExplore.vue'
import MapPoiToast from '@/components/MainMap/MapPoiToast.vue'
import NavMenu from '@/components/MainMap/NavMenu.vue'
import SnackBar from '@/components/MainMap/SnackBar.vue'
import Map from '@/components/Map/Map.vue'
import MapControls3D from '@/components/Map/MapControls3D.vue'
import MapControlsBackground from '@/components/Map/MapControlsBackground.vue'
import { ApiMenuCategory } from '@/lib/apiMenu'
import { getPoiById, getPoiByIds, ApiPoi } from '@/lib/apiPois'
import { getBBoxFeatures, getBBoxFeature, getBBoxCoordList } from '@/lib/bbox'
import { createMarkerDonutChart } from '@/lib/clusters'
import {
  DEFAULT_MAP_STYLE,
  EXPLORER_MAP_STYLE,
  MAP_STYLE_NAMES,
  LOCAL_STORAGE,
  MAP_ZOOM,
} from '@/lib/constants'
import {
  markerLayerTextFactory,
  makerHtmlFactory,
} from '@/lib/markerLayerFactory'
import { State as MenuState } from '@/store/menu'
import { filterRouteByCategories, filterRouteByPoiId } from '@/utils/styles'
import { MapStyleEnum, Mode, TupleLatLng } from '@/utils/types'
import { getHashPart, setHashPart } from '@/utils/url'
import { flattenFeatures } from '@/utils/utilities'

const POI_SOURCE = 'poi'
const FAVORITE_SOURCE = 'favorite-source'
const POI_LAYER_MARKER = 'poi-simple-marker'
const FAVORITE_LAYER_MARKER = 'favorite-layer-marker'

export default Vue.extend({
  components: {
    Map,
    MapControlsExplore,
    MapControls3D,
    MapControlsBackground,
    MapPoiToast,
    FavoritesOverlay,
    SnackBar,
    NavMenu,
    FavoriteMenu,
  },

  props: {
    defaultBounds: {
      type: [Array, Object] as PropType<LngLatBoundsLike>,
      default: null,
    },
    extraAttributions: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    small: {
      type: Boolean,
      default: false,
    },
    getSubCategory: {
      type: Function,
      default: null,
    },
    selectedCategories: {
      type: Array as PropType<ApiMenuCategory['id'][]>,
      default: () => [],
    },
    isExplorerFavorite: {
      type: Boolean,
      default: false,
    },
  },

  data(): {
    map: maplibregl.Map | null
    source: string
    pitch: number
    markers: { [id: string]: maplibregl.Marker }
    markersOnScreen: { [id: string]: maplibregl.Marker }
    poiFilter: PoiFilter | null
    selectedFeatureMarker: maplibregl.Marker | null
    selectedBackground: keyof typeof MapStyleEnum
    featuresCoordinates: { [id: string]: TupleLatLng }
    allowRegionBackZoom: boolean
    showPoiToast: boolean
    showFavoritesOverlay: boolean
  } {
    return {
      map: null,
      source: POI_SOURCE,
      pitch: 0,
      markers: {},
      markersOnScreen: {},
      poiFilter: null,
      selectedFeatureMarker: null,
      selectedBackground: DEFAULT_MAP_STYLE,
      featuresCoordinates: {},
      allowRegionBackZoom: false,
      showFavoritesOverlay: false,
      showPoiToast: false,
    }
  },

  computed: {
    ...mapGetters({
      features: 'menu/features',
      zoom: 'map/zoom',
      mode: 'map/mode',
      isModeExplorer: 'map/isModeExplorer',
      isModeFavorites: 'map/isModeFavorites',
      selectedFeature: 'map/selectedFeature',
      isLoadingFeatures: 'menu/isLoadingFeatures',
      favoritesIds: 'favorite/favoritesIds',
      favoritesAction: 'favorite/favoritesAction',
    }),

    categories(): Record<ApiMenuCategory['id'], ApiMenuCategory> {
      return this.$store.getters['menu/categories']
    },

    filters(): Array<string[]> {
      return Object.values(this.categories)
        .map((c) => c.category?.tourism_style_class)
        .filter((s) => s && Array.isArray(s))
    },

    availableStyles(): typeof MAP_STYLE_NAMES {
      return MAP_STYLE_NAMES
    },
  },

  watch: {
    small() {
      this.resizeMap()
    },

    async favoritesIds() {
      await this.handleFavorites()
    },

    async isModeFavorites() {
      await this.handleFavorites()
    },

    features(
      features: MenuState['features'],
      oldFeatures: MenuState['features']
    ) {
      if (!this.map || this.isModeFavorites) {
        return
      }

      const oldCategories: (number | undefined)[] = flattenFeatures(
        oldFeatures
      ).map((e) => e.properties.metadata?.id)
      const newCategories: (number | undefined)[] = flattenFeatures(
        features
      ).map((e) => e.properties.metadata?.id)

      // Add exact coordinates to a store to avoid rounding from Mapbox GL
      Object.keys(features).forEach((categoryIdString) => {
        const categoryId = parseInt(categoryIdString, 10)
        features[categoryId].forEach((feature) => {
          if (
            feature.geometry?.type === 'Point' &&
            feature.properties?.metadata?.id
          ) {
            this.featuresCoordinates[feature.properties.metadata.id] = feature
              .geometry.coordinates as [number, number]
          }
        })
      })

      const ApiPois = flattenFeatures(features)
      // Change visible data
      if (this.map.getSource(POI_SOURCE)) {
        if (!deepEqual(newCategories, oldCategories)) {
          // Clean-up previous cluster markers
          this.markers = {}
          Object.values(this.markersOnScreen).forEach((marker) =>
            marker.remove()
          )
          this.markersOnScreen = {}

          // Change data
          const source = this.map.getSource(POI_SOURCE)
          if (source && 'setData' in source) {
            // @ts-ignore
            source.setData({
              type: 'FeatureCollection',
              features: ApiPois,
            })
          }
        }
      }

      // Zoom back to whole region if a new category is selected
      if (
        this.allowRegionBackZoom &&
        !deepEqual(newCategories, oldCategories)
      ) {
        const ApiPois = flattenFeatures(features)
        this.handleResetMapZoom(
          ApiPois,
          this.$tc('snack.noPoi.issue'),
          this.$tc('snack.noPoi.action')
        )
      } else {
        // Made to avoid back zoom on categories reload
        this.allowRegionBackZoom = true
      }

      filterRouteByCategories(this.map, Object.keys(this.features))
    },

    selectedFeature(feature: ApiPoi) {
      if (!this.map) {
        return
      }

      // Clean-up previous marker
      if (this.selectedFeatureMarker) {
        this.selectedFeatureMarker.remove()
        this.selectedFeatureMarker = null
      }

      // Add new marker if a feature is selected
      if (
        feature &&
        (feature.properties?.metadata?.id ||
          feature?.id ||
          feature?.properties?.id)
      ) {
        filterRouteByPoiId(
          this.map,
          feature.properties?.metadata?.id ||
            feature?.id ||
            feature?.properties?.id
        )

        setHashPart(
          'poi',
          feature?.properties?.metadata?.id?.toString() ||
            feature?.id?.toString() ||
            null
        )
        this.showPoiToast = Boolean(
          feature?.properties?.metadata?.id?.toString() ||
            feature?.id?.toString()
        )
        if (feature.geometry.type === 'Point') {
          this.selectedFeatureMarker = new maplibregl.Marker({
            scale: 1.3,
            color: '#f44336',
          })
            .setLngLat(
              (Boolean(feature?.properties?.metadata?.id) &&
                this.featuresCoordinates[
                  feature?.properties?.metadata?.id || ''
                ]) ||
                (feature.geometry.coordinates as [number, number])
            )
            .addTo(this.map)
        }
      } else {
        filterRouteByCategories(this.map, Object.keys(this.features))
        this.showPoiToast = false
        setHashPart('poi', null)
      }
    },

    selectedBackground() {
      if (!this.map) {
        return
      }

      // Re-enable route highlight after style change
      const styledataCallBack = (e: MapDataEvent) => {
        if (this.map && e.dataType === 'style') {
          this.map.off('styledata', styledataCallBack)

          const feature = this.selectedFeature
          if (feature) {
            filterRouteByPoiId(
              this.map,
              feature.properties?.metadata?.id ||
                feature?.id ||
                feature?.properties?.id
            )
          }
        }
      }
      this.map.on('styledata', styledataCallBack)
    },

    mode() {
      this.allowRegionBackZoom = false

      switch (this.mode) {
        case Mode.EXPLORER: {
          if (this.selectedBackground === EXPLORER_MAP_STYLE) {
            this.poiFilter?.setIncludeFilter(this.filters)
          } else {
            this.poiFilterForExplorer()
            this.selectedBackground = EXPLORER_MAP_STYLE
          }

          setHashPart('bg', this.selectedBackground)
          break
        }
        case Mode.BROWSER:
          this.poiFilter?.remove(true)
          break
      }
    },

    showPoiToast(val) {
      this.$emit('show-poi', val)
    },
  },

  created() {
    this.pitch = this.$store.getters['map/pitch']

    this.onMapPitchEnd = throttle(this.onMapPitchEnd, 200)
    this.onMapRender = throttle(this.onMapRender, 200)
  },

  beforeMount() {
    const favorites =
      localStorage.getItem(LOCAL_STORAGE.favorites) || '{ "favorites": [] }'

    this.toggleFavoriteModes(JSON.parse(favorites).favorites)

    const mode = getHashPart('mode')
    this.setMode(mode)
    switch (mode) {
      case Mode.FAVORITES: {
        this.setFavoritesAction('open')
        break
      }
      case Mode.EXPLORER: {
        this.resizeMap()
        break
      }
      case Mode.BROWSER: {
        break
      }
    }

    const favs = getHashPart('favs')
    if (favs) {
      try {
        const newFavorite = favs
          .split(',')
          .map((e) => (!isNaN(Number(e)) ? Number(e) : null))
          .filter((e) => !!e)

        localStorage.setItem(
          LOCAL_STORAGE.favorites,
          JSON.stringify({ favorites: newFavorite, version: 1 })
        )
        this.toggleFavoriteModes(newFavorite)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Vido error:', e.message)
      }
    }

    this.selectedBackground =
      (getHashPart('bg') as keyof typeof MapStyleEnum) || DEFAULT_MAP_STYLE
  },

  mounted() {
    this.$tracking({
      type: 'page',
      title: this.$meta().refresh().metaInfo.title,
      location: window.location.href,
      path: this.$route.path,
    })
  },

  methods: {
    ...mapActions({
      setMode: 'map/setMode',
      setFavoritesAction: 'favorite/setFavoritesAction',
      toggleFavoriteModes: 'favorite/toggleFavoriteModes',
    }),

    onMapInit(map: maplibregl.Map) {
      this.map = map
      this.pitch = this.map.getPitch()

      this.poiFilter = new PoiFilter()
      this.map.addControl(this.poiFilter)

      this.map.on('data', () => {
        if (
          this.selectedBackground === DEFAULT_MAP_STYLE &&
          !this.isModeExplorer
        ) {
          this.poiFilter?.remove(true)
        }
        if (
          this.selectedBackground === DEFAULT_MAP_STYLE &&
          this.isModeExplorer
        ) {
          this.poiFilterForExplorer()
        }
      })

      this.map.on('styledata', () => {
        const ApiPois = flattenFeatures(this.features)
        this.initPoiLayer(ApiPois)
      })

      this.map.on('click', () => {
        this.unselectFeature()
        this.$emit('click')
      })

      this.map.on('moveend', () => {
        if (this.map) {
          this.$store.dispatch('map/center', this.map.getCenter())
        }
      })

      // Listen to click on POI from vector tiles (explorer mode)
      const selectFeature = (
        event: MapLayerMouseEvent | MapLayerTouchEvent
      ) => {
        const feature = event.features?.pop()
        if (feature?.properties?.popup_properties) {
          this.selectFeature(feature as ApiPoi)
        }
      }
      ;[
        'poi-level-1',
        'poi-level-2',
        'poi-level-3',
        'features_tourism-line',
        'features_tourism-fill',
      ].forEach((layer) => {
        if (this.map) {
          this.map.on('click', layer, selectFeature)
          map.on('mouseenter', layer, () => {
            map.getCanvas().style.cursor = 'pointer'
          })
          map.on('mouseleave', layer, () => {
            map.getCanvas().style.cursor = ''
          })
        }
      })

      const poiHash = getHashPart('poi')

      if (poiHash && !this.selectedFeature) {
        getPoiById(
          this.$config.API_ENDPOINT,
          this.$config.API_PROJECT,
          this.$config.API_THEME,
          poiHash
        ).then((poi) => {
          if (poi) {
            this.selectFeature(poi)
          }
        })
      }

      if (this.isModeFavorites) {
        this.handleFavorites()
      }
    },

    resizeMap() {
      setTimeout(() => this.map?.resize(), 250)
    },

    onMapPitchEnd(map: maplibregl.Map) {
      this.pitch = map.getPitch()
    },

    onMapRender() {
      const source = this.isModeFavorites ? FAVORITE_SOURCE : POI_SOURCE
      if (
        this.map &&
        this.map.getSource(source) &&
        this.map.isSourceLoaded(source)
      ) {
        this.updateMarkers(source)
      }
    },

    setPoiToastVisibility(visible: boolean) {
      this.showPoiToast = visible
    },

    exploreAroundSelectedPoi(feature?: ApiPoi) {
      if (feature) {
        this.selectFeature(feature)
      }
      if (!this.isModeExplorer) {
        this.map?.once('moveend', () => this.setMode(Mode.EXPLORER))

        this.goToSelectedPoi()

        if (this.$isMobile()) {
          this.showPoiToast = false
        }
      } else {
        this.allowRegionBackZoom = false
        this.setMode(Mode.BROWSER)
      }
    },

    toggleFavoriteMode(feature?: ApiPoi, isNotebook?: boolean) {
      if (feature && !isNotebook) {
        this.selectFeature(feature)
      }
      try {
        const props = feature?.properties
        const id = props?.metadata?.id || feature?.id
        const currentFavorites = localStorage.getItem(LOCAL_STORAGE.favorites)
        let newFavorite

        if (id) {
          if (currentFavorites) {
            const parsedFavorites = JSON.parse(currentFavorites).favorites
            if (!parsedFavorites.includes(id)) {
              newFavorite = [...parsedFavorites, id]
              this.setFavoritesAction('add')
            } else {
              newFavorite = parsedFavorites.filter(
                (f: string) => `${f}` !== `${id}`
              )
              this.setFavoritesAction('delete')
            }
          } else {
            newFavorite = [id]
            this.setFavoritesAction('add')
          }

          localStorage.setItem(
            LOCAL_STORAGE.favorites,
            JSON.stringify({ favorites: newFavorite, version: 1 })
          )
          this.toggleFavoriteModes(newFavorite)
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Vido error:', e.message)
      }
    },

    handleSnackAction() {
      this.$store.dispatch('snack/showSnack')
      if (!this.map) {
        return
      }

      this.resetZoom()
      if (this.isModeFavorites) {
        const coordinates = Object.values(this.featuresCoordinates) as [
          [number, number]
        ]
        this.map.fitBounds(getBBoxCoordList(coordinates), { maxZoom: 13 })
      } else {
        const flatten = flattenFeatures(this.features)
        if (flatten) {
          const bounds = getBBoxFeatures(flatten)
          if (bounds) {
            this.map.fitBounds(bounds, { maxZoom: 13 })
          }
        }
      }
    },

    async handleFavorites() {
      if (!this.map) {
        return
      }

      const hasFavorites = this.favoritesIds?.length > 0

      this.showFavoritesOverlay =
        this.isModeFavorites &&
        !hasFavorites &&
        this.favoritesAction !== 'delete'

      if (!hasFavorites && this.favoritesAction === 'delete') {
        this.setMode(Mode.BROWSER)
        this.setFavoritesAction('close')
      }

      if (this.isModeFavorites) {
        const allFavorites = hasFavorites
          ? await this.fetchFavorites(this.favoritesIds)
          : []

        if (hasFavorites) {
          this.handleResetMapZoom(
            allFavorites,
            this.$tc('snack.noFavorites.issue'),
            this.$tc('snack.noFavorites.action')
          )
        }

        allFavorites.forEach((feature) => {
          if (
            feature.properties?.metadata?.id &&
            feature.geometry.type === 'Point'
          ) {
            this.featuresCoordinates[feature.properties.metadata.id] = feature
              .geometry.coordinates as TupleLatLng
          }
        })

        const currentSource = this.map.getSource(FAVORITE_SOURCE)

        if (currentSource) {
          // Clean-up previous cluster markers
          this.markers = {}
          Object.values(this.markersOnScreen).forEach((marker) =>
            marker.remove()
          )
          this.markersOnScreen = {}

          // Change data
          const source = this.map.getSource(FAVORITE_SOURCE)
          if (source && 'setData' in source) {
            // @ts-ignore
            source.setData({
              type: 'FeatureCollection',
              features: allFavorites,
            })
          }
        } else {
          this.map.addSource(FAVORITE_SOURCE, {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: allFavorites,
            },
          })

          if (this.map.getLayer(POI_LAYER_MARKER))
            this.map.removeLayer(POI_LAYER_MARKER)

          if (!this.map.getLayer(FAVORITE_LAYER_MARKER)) {
            this.map.addLayer(
              markerLayerTextFactory(FAVORITE_SOURCE, FAVORITE_LAYER_MARKER)
            )
          }
        }
      } else {
        this.getSubCategory(this.selectedCategories)

        if (!this.map.getLayer(POI_LAYER_MARKER) && this.map.isStyleLoaded())
          this.map.addLayer(
            markerLayerTextFactory(POI_SOURCE, POI_LAYER_MARKER)
          )

        if (this.map.getLayer(FAVORITE_LAYER_MARKER)) {
          this.map.removeLayer(FAVORITE_LAYER_MARKER)
        }
        if (this.map.getSource(FAVORITE_SOURCE)) {
          this.map.removeSource(FAVORITE_SOURCE)
        }
      }
    },

    async fetchFavorites(ids: [string]) {
      return await getPoiByIds(
        this.$config.API_ENDPOINT,
        this.$config.API_PROJECT,
        this.$config.API_THEME,
        ids
      ).then((pois) => (pois && pois.features) || [])
    },

    showZoomSnack(text: string, textBtn: string) {
      this.$store.dispatch('snack/showSnack', {
        time: 5000,
        text,
        textBtn,
      })
    },

    goToSelectedPoi(feature?: ApiPoi) {
      if (feature) {
        this.selectFeature(feature)
      }
      if (!this.map || !this.selectedFeature) {
        return
      }
      let zoom
      if (this.selectedFeature.properties.vido_zoom) {
        zoom = this.selectedFeature.properties.vido_zoom
      } else if (this.selectedFeature.properties.vido_cat) {
        zoom = this.categories[this.selectedFeature.properties.vido_cat]
          .category.zoom
      }
      this.map.flyTo({
        center: this.selectedFeature.geometry.coordinates,
        zoom: zoom === undefined ? Math.max(this.map.getZoom(), 17) : zoom,
      })
    },

    goTo(feature: ApiPoi) {
      if (!this.map || !feature || !('coordinates' in feature.geometry)) {
        return
      }

      this.map.fitBounds(getBBoxFeature(feature), { maxZoom: 13 })
    },

    resetZoom() {
      // @ts-ignore
      this.map?.fitBounds(this.defaultBounds, {
        linear: false,
      })
    },

    handleResetMapZoom(features: ApiPoi[], text: string, textBtn: string) {
      if (!this.map) {
        return
      }

      const mapBounds = this.map.getBounds()
      const isOneInView = features.some(
        (feature) =>
          feature.geometry.type === 'Point' &&
          mapBounds.contains(feature.geometry.coordinates as [number, number])
      )

      const currentZoom = this.map.getZoom()

      if (
        !isOneInView &&
        currentZoom >= MAP_ZOOM.zoom.default &&
        features.length > 0
      ) {
        this.showZoomSnack(text, textBtn)
      }
      if (currentZoom < MAP_ZOOM.zoom.default) {
        this.resetZoom()
      }
    },

    poiFilterForExplorer() {
      if (this.map) {
        this.map.once('styledata', () => {
          this.poiFilter?.setIncludeFilter(this.filters)
          this.map?.triggerRepaint()
        })
      }
    },

    onClickChangeBackground(background: keyof typeof MapStyleEnum) {
      this.selectedBackground = background
    },

    initPoiLayer(features: ApiPoi[]) {
      if (!this.map) {
        return
      }

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
      if (!this.map.getLayer(POI_LAYER_MARKER))
        this.map.addLayer(markerLayerTextFactory(POI_SOURCE, POI_LAYER_MARKER))
    },

    selectFeature(feature: ApiPoi) {
      const goodFeature = feature

      const IsJsonString = (str: string) => {
        try {
          JSON.parse(str)
        } catch (e) {
          return false
        }
        return true
      }

      if (feature?.properties) {
        const cleanProperties: ApiPoi['properties'] = {}

        Object.keys(feature.properties).forEach((key) => {
          if (IsJsonString(feature.properties[key])) {
            cleanProperties[key] = JSON.parse(feature.properties[key])
          } else {
            cleanProperties[key] = feature.properties[key]
          }
        })

        goodFeature.properties = cleanProperties
      }

      this.$store.dispatch('map/selectFeature', goodFeature)
    },

    unselectFeature() {
      this.$store.dispatch('map/selectFeature', null)
    },

    updateMarkers(src: string) {
      if (!this.map) {
        return
      }

      const newMarkers: { [id: string]: maplibregl.Marker } = {}
      const features = this.map.querySourceFeatures(src) as ApiPoi[]
      // for every cluster on the screen, create an HTML marker for it (if we didn't yet),
      // and add it to the map if it's not there already
      features
        .filter((feature) => feature.geometry.type === 'Point')
        .forEach((feature) => {
          const coords = (feature.geometry as GeoJSON.Point).coordinates as [
            number,
            number
          ]
          const props = feature.properties
          let id: string | null = null
          let marker: maplibregl.Marker | null = null

          if (props?.cluster) {
            id = 'c' + props.cluster_id
            marker = this.markers[id]
            if (!marker) {
              const el = createMarkerDonutChart(this.categories, props)
              el.classList.add('cluster-item')
              marker = this.markers[id] = new maplibregl.Marker({
                element: el,
              }).setLngLat(coords)
              el.addEventListener('click', (e) => {
                e.stopPropagation()
                if (!this.map) return

                const source = this.map.getSource(src)

                if (source && 'getClusterLeaves' in source) {
                  // @ts-ignore
                  source.getClusterLeaves(
                    props.cluster_id,
                    100,
                    0,
                    (error: any, features: GeoJSON.Feature[]) => {
                      if (!error && this.map) {
                        const bounds = getBBoxFeatures(features)
                        if (bounds) {
                          this.map.fitBounds(bounds, { padding: 50 })
                        }
                      }
                    }
                  )
                }
              })
            }
          } else if (props?.metadata) {
            if (typeof props.metadata === 'string') {
              props.metadata = JSON.parse(props.metadata)
            }
            if (typeof props.display === 'string') {
              props.display = JSON.parse(props.display)
            }
            if (typeof props.editorial === 'string') {
              props.editorial = JSON.parse(props.editorial)
            }
            if (props?.metadata?.id) {
              id = 'm' + props.metadata.id
              marker = this.markers[id]
              const markerCoords = this.featuresCoordinates[props.metadata.id]
              if (!marker && markerCoords) {
                // Marker
                const marker = makerHtmlFactory(
                  markerCoords, // Using this to avoid misplaced marker
                  props.display?.color,
                  props.display?.icon,
                  props['image:thumbnail']
                )
                this.markers[id] = marker
                const el = marker.getElement()

                // Click handler
                if (props.editorial?.popup_properties) {
                  el.addEventListener('click', (e) => {
                    e.stopPropagation()
                    this.selectFeature(feature)

                    if (this.$isMobile()) {
                      this.resizeMap()
                    }
                  })
                }
              }
            }
          }

          if (marker && id && this.map) {
            newMarkers[id] = marker
            if (!this.markersOnScreen[id]) marker.addTo(this.map)
          }
        })
      // for every marker we've added previously, remove those that are no longer visible
      for (const id in this.markersOnScreen) {
        if (!newMarkers[id]) this.markersOnScreen[id].remove()
      }
      this.markersOnScreen = newMarkers

      // Put selected feature marker above
      if (this.selectedFeatureMarker) {
        this.selectedFeatureMarker.remove()
        this.selectedFeatureMarker.addTo(this.map)
      }
    },
  },
})
</script>

<style>
.cluster-item {
  cursor: pointer;
}
.cluster-donut {
  @apply text-sm leading-none font-medium block text-gray-800;
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
