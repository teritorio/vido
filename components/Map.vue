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
          !small && !isModeExplorer && 'mt-20 sm:mt-0 h-4/5 sm:h-full',
        ]"
      >
        <mapbox
          v-if="mapStyle"
          class="h-full"
          access-token=""
          :map-options="{
            center: [center.lng, center.lat],
            hash: 'map',
            maxZoom: zoom.max,
            minZoom: zoom.min,
            pitch,
            style: mapStyle,
            zoom: zoom.default,
          }"
          :nav-control="{
            show: false,
          }"
          :attribution-control="{
            position: 'bottom-right',
            show: true,
          }"
          @map-init="onMapInit"
          @map-pitchend="onMapPitchEnd"
          @map-data="onMapRender"
          @map-dragend="onMapRender"
          @map-moveend="onMapRender"
          @map-resize="onMapRender"
          @map-rotateend="onMapRender"
          @map-touchmove="onMapRender"
          @map-zoomend="onMapRender"
        />
      </div>

      <MapControls
        :has-favorites="favoritesIds.length !== 0"
        :backgrounds="availableStyles"
        :dense="small"
        :is-mode-favorite="isModeFavorite"
        :initial-background="selectedBackground"
        :map="map"
        :pitch="pitch"
        @changeBackground="onClickChangeBackground"
        @change-mode="onControlChangeMode"
        @locale="languageControl.setLanguage($event)"
      />

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
import { OpenMapTilesLanguage } from '@teritorio/openmaptiles-gl-language'
import { deepEqual } from 'fast-equals'
import GeoJSON from 'geojson'
import throttle from 'lodash.throttle'
import Mapbox from 'mapbox-gl-vue'
import maplibregl, { MapLayerMouseEvent, MapLayerTouchEvent } from 'maplibre-gl'
import Vue, { PropType } from 'vue'
import { mapGetters, mapActions } from 'vuex'

import FavoritesOverlay from '@/components/FavoritesOverlay.vue'
import MapControls from '@/components/MapControls.vue'
import MapPoiToast from '@/components/MapPoiToast.vue'
import SnackBar from '@/components/SnackBar.vue'
import TeritorioIconBadge from '@/components/TeritorioIcon/TeritorioIconBadge.vue'
import { getBBoxFeatures, getBBoxFeature, getBBoxCoordList } from '@/lib/bbox'
import { createMarkerDonutChart } from '@/lib/clusters'
import {
  DEFAULT_MAP_STYLE,
  EXPLORER_MAP_STYLE,
  MAP_STYLES,
  LOCAL_STORAGE,
} from '@/lib/constants'
import { markerLayerFactory } from '@/lib/markerLayerFactory'
import { State as MenuState } from '@/store/menu'
import { getPoiById, getPoiByIds } from '@/utils/api'
import {
  Category,
  MapStyle,
  Mode,
  TupleLatLng,
  VidoFeature,
  VidoMglStyle,
} from '@/utils/types'
import { getHashPart, setHashPart } from '@/utils/url'
import { flattenFeatures } from '@/utils/utilities'

const POI_SOURCE = 'poi'
const FAVORITE_SOURCE = 'favorite-source'
const POI_LAYER_MARKER = 'poi-simple-marker'
const FAVORITE_LAYER_MARKER = 'favorite-layer-marker'

const Map = Vue.extend({
  components: {
    Mapbox,
    MapControls,
    MapPoiToast,
    FavoritesOverlay,
    SnackBar,
  },

  props: {
    small: {
      type: Boolean,
      default: false,
    },
    getSubCategory: {
      type: Function,
      default: null,
    },
    selectedCategories: {
      type: Array as PropType<Category['id'][]>,
      default: () => [],
    },
  },

  data(): {
    map: maplibregl.Map | null
    languageControl: OpenMapTilesLanguage | null
    source: string
    pitch: number
    markers: { [id: string]: maplibregl.Marker }
    markersOnScreen: { [id: string]: maplibregl.Marker }
    poiFilter: PoiFilter | null
    selectedFeatureMarker: maplibregl.Marker | null
    selectedBackground: keyof typeof MapStyle
    featuresCoordinates: { [id: string]: TupleLatLng }
    allowRegionBackZoom: boolean
    showPoiToast: boolean
    showFavoritesOverlay: boolean
    previousCategories: Category['id'][]
    mapStyles: Record<string, string | VidoMglStyle>
    mapStyle: string | VidoMglStyle | null
  } {
    return {
      map: null,
      languageControl: null,
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
      previousCategories: [],
      mapStyles: {},
      mapStyle: null,
    }
  },
  async fetch() {
    const vectoFetch = fetch(this.$config.VECTO_STYLE_URL)
      .then((res) => res.json())
      .then((vectoStyle) => {
        if (vectoStyle?.sources?.openmaptiles.url) {
          vectoStyle.sources.openmaptiles.url = this.$config.VECTO_TILES_URL
        }
        return vectoStyle
      })

    const satelliteFetch = fetch(this.$config.SATELLITE_STYLE_URL)
      .then((res) => res.json())
      .then((satelliteStyle) => {
        if (satelliteStyle?.sources?.openmaptiles.url) {
          satelliteStyle.sources.openmaptiles.url = this.$config.VECTO_TILES_URL
        }
        return satelliteStyle
      })

    const [vectoStyle, satelliteStyle] = await Promise.all([
      vectoFetch,
      satelliteFetch,
    ])

    this.mapStyles = {
      [MapStyle.teritorio]: vectoStyle,
      [MapStyle.mapnik]: {
        version: 8,
        name: this.$tc('map.mapnik.name'),
        vido_israster: true,
        glyphs: 'https://vecto.teritorio.xyz/fonts/{fontstack}/{range}.pbf',
        sources: {
          mapnik: {
            type: 'raster',
            tiles: [
              // 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', // Main OSM tiles
              'https://a.tiles.teritorio.xyz/styles/osm/{z}/{x}/{y}.png',
              'https://b.tiles.teritorio.xyz/styles/osm/{z}/{x}/{y}.png',
              'https://c.tiles.teritorio.xyz/styles/osm/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: this.$tc('map.mapnik.attribution'),
          },
        },
        layers: [
          {
            id: 'mapnik',
            type: 'raster',
            source: 'mapnik',
            minzoom: 1,
            maxzoom: 20,
          },
        ],
      },
      [MapStyle.aerial]: satelliteStyle,
    }

    this.mapStyle =
      this.mapStyles[this.selectedBackground] ||
      this.mapStyles[DEFAULT_MAP_STYLE]
  },

  computed: {
    ...mapGetters({
      center: 'map/center',
      features: 'menu/features',
      zoom: 'map/zoom',
      mode: 'site/mode',
      selectedFeature: 'map/selectedFeature',
      isLoadingFeatures: 'menu/isLoadingFeatures',
      favoritesIds: 'favorite/favoritesIds',
      isModeFavorite: 'favorite/isModeFavorite',
      favoritesAction: 'favorite/favoritesAction',
    }),

    categories(): Record<Category['id'], Category> {
      return this.$store.getters['menu/categories']
    },

    filters(): Array<string[]> {
      return Object.values(this.categories)
        .filter(
          (c) =>
            c.metadata.tourism_style_merge &&
            Array.isArray(c.metadata.tourism_style_class)
        )
        .map((c) => c.metadata.tourism_style_class)
    },

    isModeExplorer(): boolean {
      return this.mode === Mode.EXPLORER
    },

    availableStyles(): typeof MAP_STYLES {
      return MAP_STYLES
    },
  },

  watch: {
    small() {
      this.resizeMap()
    },

    async favoritesIds() {
      await this.handleFavorites()
    },

    async isModeFavorite() {
      await this.handleFavorites()
    },

    features(
      features: MenuState['features'],
      oldFeatures: MenuState['features']
    ) {
      if (!this.map || this.isModeFavorite) {
        return
      }

      const oldCategories: (string | undefined)[] = flattenFeatures(
        oldFeatures
      ).map((e) => e.properties.metadata?.PID)
      const newCategories: (string | undefined)[] = flattenFeatures(
        features
      ).map((e) => e.properties.metadata?.PID)

      // Add exact coordinates to a store to avoid rounding from Mapbox GL
      Object.keys(features).forEach((categoryIdString) => {
        const categoryId = parseInt(categoryIdString, 10)
        features[categoryId].forEach((feature) => {
          if (
            feature.geometry.type === 'Point' &&
            feature.properties?.metadata?.PID
          ) {
            this.featuresCoordinates[feature.properties.metadata.PID] = feature
              .geometry.coordinates as [number, number]
          }
        })
      })

      const vidoFeatures = flattenFeatures(features)
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
          if ('setData' in source) {
            source.setData({
              type: 'FeatureCollection',
              features: vidoFeatures,
            })
          }
        }
      }

      // Zoom back to whole region if a new category is selected
      if (
        this.allowRegionBackZoom &&
        !deepEqual(newCategories, oldCategories)
      ) {
        this.resetMapview().then(() => {
          const vidoFeatures = flattenFeatures(features)
          this.handleResetMapZoom(
            vidoFeatures,
            this.$tc('snack.noPoi.issue'),
            this.$tc('snack.noPoi.action')
          )
        })
      } else {
        // Made to avoid back zoom on categories reload
        this.allowRegionBackZoom = true
      }
    },

    selectedFeature(feature: VidoFeature) {
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
        feature.geometry.type === 'Point' &&
        (feature.properties?.metadata?.PID ||
          feature?.id ||
          feature?.properties?.id)
      ) {
        setHashPart(
          'poi',
          feature?.properties?.metadata?.PID || feature?.id?.toString() || null
        )
        this.showPoiToast = Boolean(
          feature?.properties?.metadata?.PID || feature?.id?.toString()
        )
        this.selectedFeatureMarker = new maplibregl.Marker({
          scale: 1.3,
          color: '#f44336',
        })
          .setLngLat(
            (Boolean(feature?.properties?.metadata?.PID) &&
              this.featuresCoordinates[
                feature?.properties?.metadata?.PID || ''
              ]) ||
              (feature.geometry.coordinates as [number, number])
          )
          .addTo(this.map)
      } else {
        this.showPoiToast = false
        setHashPart('poi', null)
      }
    },

    selectedBackground() {
      if (!this.map) {
        return
      }

      this.mapStyle = this.mapStyles[this.selectedBackground]
      this.map.setStyle(this.mapStyle)
    },

    mode() {
      switch (this.mode) {
        case Mode.EXPLORER: {
          const alreadyOnExplorerMapStyle =
            this.selectedBackground === EXPLORER_MAP_STYLE

          this.selectedBackground = EXPLORER_MAP_STYLE
          if (this.mapStyle) {
            this.map?.setStyle(this.mapStyle)
          }

          setHashPart('bg', this.selectedBackground)
          setHashPart('explorer', '1')

          if (alreadyOnExplorerMapStyle) {
            this.poiFilterForExplorer()
          }
          break
        }
        case Mode.BROWSER:
          setHashPart('explorer', null)
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

    this.$store.dispatch(
      'favorite/toggleFavoriteModes',
      JSON.parse(favorites).favorites
    )

    this.$store.dispatch(
      'favorite/handleFavoriteLayer',
      getHashPart('fav') === '1'
    )

    if (getHashPart('fav') === '1') {
      this.$store.dispatch('favorite/setFavoritesAction', 'open')
    }

    if (getHashPart('explorer') === '1') {
      this.setMode(Mode.EXPLORER)
      this.resizeMap()
    }

    const favs = getHashPart('favs')
    if (favs) {
      try {
        const newFavorite = favs.split(',')

        localStorage.setItem(
          LOCAL_STORAGE.favorites,
          JSON.stringify({ favorites: newFavorite, version: 1 })
        )
        this.$store.dispatch('favorite/toggleFavoriteModes', newFavorite)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Vido error:', e.message)
      }
    }

    this.selectedBackground =
      (getHashPart('bg') as keyof typeof MapStyle) || DEFAULT_MAP_STYLE
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
      resetMapview: 'map/resetMapview',
      setMode: 'site/setMode',
    }),

    onMapInit(map: maplibregl.Map) {
      this.map = map

      this.poiFilter = new PoiFilter()
      this.map.addControl(this.poiFilter)

      this.languageControl = new OpenMapTilesLanguage()
      this.map.addControl(this.languageControl)

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
        const vidoFeatures = flattenFeatures(this.features)
        this.initPoiLayer(vidoFeatures)
      })

      this.map.on('click', () => {
        this.unselectFeature()
        this.$emit('click')
      })

      // Listen to click on POI from vector tiles (explorer mode)
      const selectFeature = (
        event: MapLayerMouseEvent | MapLayerTouchEvent
      ) => {
        const feature = event.features?.pop()
        if (feature) {
          this.selectFeature(feature as VidoFeature)
        }
      }
      this.map.on('click', 'poi-level-1', selectFeature)
      this.map.on('click', 'poi-level-2', selectFeature)
      this.map.on('click', 'poi-level-3', selectFeature)

      const poiHash = getHashPart('poi')

      if (poiHash && !this.selectedFeature) {
        getPoiById(this.$config.API_ENDPOINT, poiHash).then((poi) => {
          if (poi) {
            this.selectFeature(poi)
          }
        })
      }
    },

    resizeMap() {
      setTimeout(() => this.map?.resize(), 250)
    },

    onMapPitchEnd(map: maplibregl.Map) {
      this.pitch = map.getPitch()
    },

    onMapRender() {
      const source = this.isModeFavorite ? FAVORITE_SOURCE : POI_SOURCE
      if (
        this.map &&
        this.map.getSource(source) &&
        this.map.isSourceLoaded(source)
      ) {
        this.updateMarkers(source)
      }
    },

    onControlChangeMode(mode: Mode) {
      this.allowRegionBackZoom = false
      this.$emit('change-mode', mode)
    },

    setPoiToastVisibility(visible: boolean) {
      this.showPoiToast = visible
    },

    exploreAroundSelectedPoi() {
      if (!this.isModeExplorer) {
        this.map?.once('moveend', () => {
          this.$emit('change-mode', Mode.EXPLORER)
        })

        this.goToSelectedPoi()

        if (this.$isMobile()) {
          this.showPoiToast = false
        }
      } else {
        this.allowRegionBackZoom = false
        this.$emit('change-mode', Mode.BROWSER)
      }
    },

    toggleFavoriteMode() {
      try {
        const props = this.selectedFeature?.properties
        const id = props?.metadata?.PID || `${this.selectedFeature?.id}`
        const currentFavorites = localStorage.getItem(LOCAL_STORAGE.favorites)
        let newFavorite

        if (currentFavorites) {
          const parsedFavorites = JSON.parse(currentFavorites).favorites
          if (!parsedFavorites.includes(id)) {
            newFavorite = [...parsedFavorites, id]
            this.$store.dispatch('favorite/setFavoritesAction', 'add')
          } else {
            newFavorite = parsedFavorites.filter((f: string) => f !== id)
            this.$store.dispatch('favorite/setFavoritesAction', 'delete')
          }
        } else {
          newFavorite = [id]
          this.$store.dispatch('favorite/setFavoritesAction', 'add')
        }

        localStorage.setItem(
          LOCAL_STORAGE.favorites,
          JSON.stringify({ favorites: newFavorite, version: 1 })
        )
        this.$store.dispatch('favorite/toggleFavoriteModes', newFavorite)
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
      if (this.isModeFavorite) {
        const coordinates = Object.values(this.featuresCoordinates) as [
          [number, number]
        ]
        this.map.fitBounds(getBBoxCoordList(coordinates), { maxZoom: 13 })
      } else {
        const flatten = flattenFeatures(this.features)
        if (flatten) {
          this.map.fitBounds(getBBoxFeatures(flatten), { maxZoom: 13 })
        }
      }
    },

    async handleFavorites() {
      if (!this.map) {
        return
      }

      const hasFavorites = this.favoritesIds?.length > 0

      this.showFavoritesOverlay =
        this.isModeFavorite &&
        !hasFavorites &&
        this.favoritesAction !== 'delete'

      if (!hasFavorites && this.favoritesAction === 'delete') {
        setHashPart('fav', null)
        this.$store.dispatch('favorite/handleFavoriteLayer', false)
        this.$store.dispatch('favorite/setFavoritesAction', 'close')
      }

      if (this.isModeFavorite) {
        const allFavorites = hasFavorites
          ? await this.fetchFavorites(this.favoritesIds)
          : []

        this.resetMapview().then(() => {
          if (hasFavorites) {
            this.handleResetMapZoom(
              allFavorites,
              this.$tc('snack.noFavorites.issue'),
              this.$tc('snack.noFavorites.action')
            )
          }
        })

        allFavorites.forEach((feature) => {
          if (
            feature.properties?.metadata?.PID &&
            feature.geometry.type === 'Point'
          ) {
            this.featuresCoordinates[feature.properties.metadata.PID] = feature
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
              markerLayerFactory(FAVORITE_SOURCE, FAVORITE_LAYER_MARKER)
            )
          }
        }
      } else {
        this.getSubCategory(this.selectedCategories)

        if (!this.map.getLayer(POI_LAYER_MARKER) && this.map.isStyleLoaded())
          this.map.addLayer(markerLayerFactory(POI_SOURCE, POI_LAYER_MARKER))

        if (this.map.getLayer(FAVORITE_LAYER_MARKER)) {
          this.map.removeLayer(FAVORITE_LAYER_MARKER)
        }
        if (this.map.getSource(FAVORITE_SOURCE)) {
          this.map.removeSource(FAVORITE_SOURCE)
        }
      }
    },

    async fetchFavorites(ids: [string]) {
      return await getPoiByIds(this.$config.API_ENDPOINT, ids).then(
        (pois) => pois.features
      )
    },

    showZoomSnack(text: string, textBtn: string) {
      this.$store.dispatch('snack/showSnack', {
        time: 5000,
        text,
        textBtn,
      })
    },

    goToSelectedPoi() {
      if (!this.map || !this.selectedFeature) {
        return
      }
      let zoom
      if (this.selectedFeature.properties.vido_zoom) {
        zoom = this.selectedFeature.properties.vido_zoom
      } else if (this.selectedFeature.properties.vido_cat) {
        zoom = this.categories[this.selectedFeature.properties.vido_cat]
          .metadata.selection_zoom
      }
      this.map.flyTo({
        center: this.selectedFeature.geometry.coordinates,
        zoom: zoom === undefined ? Math.max(this.map.getZoom(), 17) : zoom,
      })
    },

    goTo(feature: VidoFeature) {
      if (!this.map || !feature || !('coordinates' in feature.geometry)) {
        return
      }

      this.map.fitBounds(getBBoxFeature(feature), { maxZoom: 13 })
    },

    resetZoom() {
      this.map?.flyTo({
        center: [this.center.lng, this.center.lat],
        zoom: this.zoom.default,
      })
    },

    handleResetMapZoom(features: VidoFeature[], text: string, textBtn: string) {
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
        currentZoom >= this.zoom.default &&
        features.length > 0
      ) {
        this.showZoomSnack(text, textBtn)
      }
      if (currentZoom < this.zoom.default) {
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

    onClickChangeBackground(background: keyof typeof MapStyle) {
      this.selectedBackground = background
    },

    initPoiLayer(features: VidoFeature[]) {
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
        this.map.addLayer(markerLayerFactory(POI_SOURCE, POI_LAYER_MARKER))
    },

    selectFeature(feature: VidoFeature) {
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
        const cleanProperties: VidoFeature['properties'] = {}

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
      const features = this.map.querySourceFeatures(src) as VidoFeature[]
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
              marker = this.markers[id] = new maplibregl.Marker({
                element: el,
              }).setLngLat(coords)
              el.addEventListener('click', (e) => {
                e.stopPropagation()
                if (!this.map) return

                const source = this.map.getSource(src)

                if (source && 'getClusterLeaves' in source) {
                  source.getClusterLeaves(
                    props.cluster_id,
                    100,
                    0,
                    (error, features) => {
                      if (!error && this.map) {
                        const bounds = getBBoxFeatures(features)
                        this.map.fitBounds(bounds, { padding: 50 })
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
            if (props?.metadata?.PID) {
              id = 'm' + props.metadata.PID
              marker = this.markers[id]
              const markerCoords = this.featuresCoordinates[props.metadata.PID]
              if (!marker && markerCoords) {
                // Marker
                const el: HTMLElement = document.createElement('div')
                el.classList.add('maplibregl-marker')

                marker = this.markers[id] = new maplibregl.Marker({
                  element: el,
                }).setLngLat(markerCoords) // Using this to avoid misplaced marker

                // Teritorio badge
                const instance = new TeritorioIconBadge({
                  propsData: {
                    color: props.metadata.color,
                    picto: props.metadata.icon,
                    image: props.metadata['image:thumbnail'],
                  },
                }).$mount()
                el.appendChild(instance.$el)

                // Click handler
                if (props.metadata.HasPopup === 'yes') {
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

export type MapRef = InstanceType<typeof Map>

export default Map
</script>

<style>
.cluster-donut {
  @apply text-sm leading-none font-medium block text-gray-800;
}
</style>
