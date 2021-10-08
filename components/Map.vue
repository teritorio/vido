<template>
  <div class="w-full h-full">
    <div
      :class="[
        'relative flex flex-col w-full sm:h-full',
        small && 'h-2/5',
        !small && 'h-full',
      ]"
    >
      <div
        :class="[
          'flex-grow overflow-hidden',
          !small && !isModeExplorer && 'mt-20 sm:mt-0 h-4/5 sm:h-full',
        ]"
      >
        <client-only>
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
        </client-only>
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
      />

      <div
        class="fixed inset-x-0 bottom-0 flex justify-center overflow-y-auto pointer-events-none h-3/5 sm:h-auto sm:inset-x-3 sm:bottom-3"
      >
        <MapPoiToast
          v-if="selectedFeature && showPoiToast"
          :poi="selectedFeature"
          class="flex-grow-0"
          @explore-click="exploreAroundSelectedPoi"
          @favorite-click="toggleFavoriteMode"
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
      <SnackBar @snack-action-click="handleSnackAction" />
    </div>
  </div>
</template>

<script lang="ts">
import { PoiFilter } from '@teritorio/map'
import { deepEqual } from 'fast-equals'
import GeoJSON from 'geojson'
import throttle from 'lodash.throttle'
import Mapbox from 'mapbox-gl-vue'
import mapboxgl, { MapLayerMouseEvent, MapLayerTouchEvent } from 'maplibre-gl'
import OpeningHours from 'opening_hours'
import Vue, { PropType } from 'vue'
import { mapGetters, mapActions } from 'vuex'

import FavoritesOverlay from '@/components/FavoritesOverlay.vue'
import MapControls from '@/components/MapControls.vue'
import MapPoiToast from '@/components/MapPoiToast.vue'
import SnackBar from '@/components/SnackBar.vue'
import TeritorioIconBadge from '@/components/TeritorioIcon/TeritorioIconBadge.vue'
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
import {
  flattenFeatures,
  getPreviousMonday,
  displayTime,
} from '@/utils/utilities'

const POI_SOURCE = 'poi'
const FAVORITE_SOURCE = 'favorite-source'
const POI_LAYER_MARKER = 'poi-simple-marker'
const FAVORITE_LAYER_MARKER = 'favorite-layer-marker'

export default Vue.extend({
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
    map: mapboxgl.Map | null
    source: string
    pitch: number
    markers: { [id: string]: mapboxgl.Marker }
    markersOnScreen: { [id: string]: mapboxgl.Marker }
    poiFilter: PoiFilter | null
    selectedFeatureMarker: mapboxgl.Marker | null
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
        name: 'Teritorio Mapnik',
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
            attribution:
              '<a href="https://www.openstreetmap.org/copyright" rel="noopener noreferrer" target="_blank">&copy; OpenStreetMap contributors</a> <a href="https://www.teritorio.fr/" rel="noopener noreferrer" target="_blank">&copy; Teritorio</a>',
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
      setTimeout(() => this.map?.resize(), 250)
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

      const oldCategories: string[] = flattenFeatures(oldFeatures).map(
        (e) => e?.properties?.metadata?.PID
      )
      const newCategories: string[] = flattenFeatures(features).map(
        (e) => e?.properties?.metadata?.PID
      )

      // Add exact coordinates to a store to avoid rounding from Mapbox GL
      Object.keys(features).forEach((categoryId) => {
        features[categoryId].forEach((feature) => {
          this.featuresCoordinates[feature.properties.metadata.PID] =
            feature.geometry.coordinates
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
            'Pas de résultat correspondant.',
            'Voir des lieux plus éloignés ?'
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
      if (feature) {
        setHashPart(
          'poi',
          feature?.properties?.metadata?.PID || feature?.id?.toString() || null
        )
        this.showPoiToast = true
        this.selectedFeatureMarker = new mapboxgl.Marker({
          scale: 1.3,
          color: '#f44336',
        })
          .setLngLat(
            this.featuresCoordinates[feature.properties.metadata?.PID] ||
              feature.geometry.coordinates
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

          if (alreadyOnExplorerMapStyle) {
            this.poiFilterForExplorer()
          }
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

  methods: {
    ...mapActions({
      resetMapview: 'map/resetMapview',
    }),

    onMapInit(map: mapboxgl.Map) {
      this.map = map

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
        this.selectFeature(event.features?.pop())
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

    onMapPitchEnd(map: mapboxgl.Map) {
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
      if (this.isModeExplorer) {
        this.allowRegionBackZoom = false
        this.$emit('change-mode', Mode.BROWSER)
      } else {
        this.goToSelectedPoi()
        // @ts-ignore
        if (this.$isMobile()) {
          this.showPoiToast = false
        }
        this.$emit('change-mode', Mode.EXPLORER)
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
      this.resetZoom()
      this.$store.dispatch('snack/showSnack', null)
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
              'Pas de favori ici.',
              'Voir tous les favoris ?'
            )
          }
        })

        allFavorites.forEach((feature) => {
          this.featuresCoordinates[feature.properties.metadata.PID] =
            feature.geometry.coordinates
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

        if (!this.map.getLayer(POI_LAYER_MARKER))
          this.map.addLayer(markerLayerFactory(POI_SOURCE, POI_LAYER_MARKER))

        if (this.map.getLayer(FAVORITE_LAYER_MARKER)) {
          this.map.removeLayer(FAVORITE_LAYER_MARKER)
        }
        if (this.map.getSource(FAVORITE_SOURCE)) {
          this.map.removeSource(FAVORITE_SOURCE)
        }
      }
    },

    async fetchFavorites(ids) {
      return await getPoiByIds(this.$config.API_ENDPOINT, ids)
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

    getBBox(feature: GeoJSON.Feature): mapboxgl.LngLatBoundsLike {
      const coords = feature.geometry.coordinates
      let bounds: mapboxgl.LngLatBounds

      switch (feature.geometry.type) {
        case 'LineString':
          bounds = coords.reduce(
            (bounds: mapboxgl.LngLatBounds, coord: mapboxgl.LngLat) => {
              return bounds.extend(coord)
            },
            new mapboxgl.LngLatBounds(coords[0], coords[0])
          )
          break

        case 'Polygon':
          bounds = coords
            .flat(2)
            .reduce((bounds: mapboxgl.LngLatBounds, coord: mapboxgl.LngLat) => {
              return bounds.extend(coord)
            }, new mapboxgl.LngLatBounds(coords[0], coords[0]))
          break

        case 'Point':
        default:
          bounds = new mapboxgl.LngLatBounds([coords, coords])
          break
      }

      return bounds
    },

    goTo(feature: VidoFeature) {
      if (!this.map || !feature || !('coordinates' in feature.geometry)) {
        return
      }

      this.map.fitBounds(this.getBBox(feature), { maxZoom: 13 })
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
      const isOneInView = features.some((feature) =>
        mapBounds.contains(feature.geometry.coordinates)
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
      this.poiFilter?.setIncludeFilter(this.filters)
      this.map?.triggerRepaint()
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
          clusterRadius: 64,
          clusterProperties: clusterProps,
          clusterMaxZoom: 15,
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
        const cleanProperties = {}

        Object.keys(feature.properties).forEach((key) => {
          if (key === 'opening_hours') {
            const days = [
              'Dim.',
              'Lun.',
              'Mar.',
              'Mer.',
              'Jeu.',
              'Ven.',
              'Sam.',
            ]
            const prevMonday = new Date(getPreviousMonday())
            const oneWeek = new Date(prevMonday)
            oneWeek.setDate(oneWeek.getDate() + 7)

            const oh = new OpeningHours(feature.properties[key])
            const iterator = oh.getIterator(prevMonday)
            const openingString = []
            const ranges = []
            let date = { range: [] }

            while (iterator.advance(oneWeek)) {
              const intDate = iterator.getDate()
              const day = intDate.getDay()

              if (days[day] === date.day) {
                date.range.push(displayTime(intDate))
              } else {
                if (date.range.length > 0) {
                  ranges.push(date)
                }
                date = { day: days[day], range: [displayTime(intDate)] }
              }
            }

            ranges.forEach((range) => {
              const timeRanges = ['', '']
                .map((_, i) => range.range.slice(i * 2, (i + 1) * 2))
                .map((e) => e.join('-'))
                .filter((e) => Boolean(e))

              openingString.push(
                `${range.day} ${timeRanges[0]}${
                  timeRanges.length > 1 ? `  ${timeRanges[1]}` : ''
                }`
              )
            })

            cleanProperties[key] = openingString
          } else if (IsJsonString(feature.properties[key])) {
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
      const newMarkers: { [id: string]: mapboxgl.Marker } = {}
      const features = this.map.querySourceFeatures(src) as VidoFeature[]
      // for every cluster on the screen, create an HTML marker for it (if we didn't yet),
      // and add it to the map if it's not there already
      for (let i = 0; i < features.length; i++) {
        const coords = features[i].geometry.coordinates
        const props = features[i].properties
        let id: string | null = null
        let marker: mapboxgl.Marker | null = null

        if (props?.cluster) {
          id = 'c' + props.cluster_id
          marker = this.markers[id]
          if (!marker) {
            const el = createMarkerDonutChart(this.categories, props)
            marker = this.markers[id] = new mapboxgl.Marker({
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
                      const bounds = features.reduce(
                        (
                          bounds: mapboxgl.LngLatBounds,
                          coord: GeoJSON.Feature<GeoJSON.Geometry>
                        ) => {
                          return bounds.extend(this.getBBox(coord))
                        },
                        new mapboxgl.LngLatBounds(coords, coords)
                      )

                      this.map.fitBounds(bounds, { padding: 50 })
                    }
                  }
                )
              }
            })
          }
        } else if (props) {
          if (typeof props.metadata === 'string') {
            props.metadata = JSON.parse(props.metadata)
          }
          id = 'm' + props.metadata.PID
          marker = this.markers[id]
          const markerCoords = this.featuresCoordinates[props.metadata.PID]
          if (!marker && markerCoords) {
            // Marker
            const el: HTMLElement = document.createElement('div')
            el.classList.add('mapboxgl-marker')
            marker = this.markers[id] = new mapboxgl.Marker({
              element: el,
            }).setLngLat(markerCoords) // Using this to avoid misplaced marker

            // Teritorio badge
            const instance = new TeritorioIconBadge({
              propsData: {
                color: props.metadata.color,
                picto: props.metadata.icon,
              },
            }).$mount()
            el.appendChild(instance.$el)

            // Click handler
            if (props.metadata.HasPopup === 'yes') {
              el.addEventListener('click', (e) => {
                e.stopPropagation()
                this.selectFeature(features[i])
              })
            }
          }
        }

        if (marker && id) {
          newMarkers[id] = marker
          if (!this.markersOnScreen[id]) marker.addTo(this.map)
        }
      }
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
.cluster-donut {
  @apply text-sm leading-none font-medium block text-gray-800;
}
</style>
