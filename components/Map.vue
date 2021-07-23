<template>
  <div class="w-full h-full">
    <div
      :class="[
        'relative flex flex-col w-full sm:h-full',
        small && 'h-2/5',
        !small && 'h-full',
      ]"
    >
      <div class="flex-grow overflow-hidden">
        <mapbox
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
          @map-dataloading="onMapRender"
          @map-drag="onMapRender"
          @map-move="onMapRender"
          @map-pitch="onMapRender"
          @map-resize="onMapRender"
          @map-rotate="onMapRender"
          @map-touchmove="onMapRender"
          @map-zoom="onMapRender"
        />
      </div>

      <MapControls
        :backgrounds="availableStyles"
        :dense="small"
        :is-mode-favorite="isModeFavorite"
        :initial-background="selectedBackground"
        :map="map"
        :pitch="pitch"
        :styles="mapStyles"
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
          @click="goToSelectedPoi"
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
    </div>
  </div>
</template>

<script lang="ts">
import { PoiFilter } from '@teritorio/map'
import { deepEqual } from 'fast-equals'
import throttle from 'lodash.throttle'
import Mapbox from 'mapbox-gl-vue'
import mapboxgl, { MapLayerMouseEvent, MapLayerTouchEvent } from 'maplibre-gl'
import Vue, { PropType } from 'vue'
import { mapGetters, mapActions } from 'vuex'

import MapControls from '@/components/MapControls.vue'
import MapPoiToast from '@/components/MapPoiToast.vue'
import TeritorioIconBadge from '@/components/TeritorioIcon/TeritorioIconBadge.vue'
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

const POI_SOURCE = 'poi'
const FAVORITE_SOURCE = 'favorite-source'
const POI_LAYER_MARKER = 'poi-simple-marker'
const FAVORITE_LAYER_MARKER = 'favorite-layer-marker'

export default Vue.extend({
  components: {
    Mapbox,
    MapControls,
    MapPoiToast,
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
    previousCategories: Category['id'][]
    tourismStyleWithProxyTiles: VidoMglStyle | null
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
      showPoiToast: false,
      previousCategories: [],
      tourismStyleWithProxyTiles: null,
    }
  },
  async fetch() {
    this.tourismStyleWithProxyTiles = await fetch(
      this.$config.VECTO_STYLE_URL
    ).then((res) => res.json())

    if (this.tourismStyleWithProxyTiles?.sources?.openmaptiles.url) {
      this.tourismStyleWithProxyTiles.sources.openmaptiles.url = this.$config.VECTO_TILES_URL
    }
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
    }),

    categories(): Record<Category['id'], Category> {
      return this.$store.getters['menu/categories']
    },

    isModeExplorer(): boolean {
      return this.mode === Mode.EXPLORER
    },

    mapStyle(): string | VidoMglStyle {
      const styles = this.mapStyles

      return styles[this.selectedBackground] || styles[DEFAULT_MAP_STYLE]
    },

    mapStyles(): Record<string, string | VidoMglStyle> {
      return {
        [MapStyle.teritorio]:
          this.tourismStyleWithProxyTiles || this.$config.VECTO_STYLE_URL,
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
        [MapStyle.aerial]: {
          version: 8,
          name: 'Imagerie aérienne IGN',
          // TODO: To re-enable for https://github.com/teritorio/vido/issues/67
          // sprite: `https://vecto-dev.teritorio.xyz/styles/teritorio-tourism-proxy/sprite?key=${this.$config.TILES_TOKEN}`,
          // glyphs: `https://vecto-dev.teritorio.xyz/fonts/{fontstack}/{range}.pbf?key=${this.$config.TILES_TOKEN}`,
          vido_israster: true,
          glyphs: 'https://vecto.teritorio.xyz/fonts/{fontstack}/{range}.pbf',
          sources: {
            aerial: {
              type: 'raster',
              tiles: [
                `https://wxs.ign.fr/${this.$config.IGN_TOKEN}/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/jpeg`,
              ],
              tileSize: 256,
              attribution:
                '<a href="https://ign.fr/" rel="noopener noreferrer" target="_blank">&copy; IGN</a>',
            },
          },
          layers: [
            {
              id: 'aerial',
              type: 'raster',
              source: 'aerial',
              minzoom: 1,
              maxzoom: 21,
            },
          ],
        },
      }
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

      // Add exact coordinates to a store to avoid rounding from Mapbox GL
      Object.keys(features).forEach((categoryId) => {
        features[categoryId].forEach((feature) => {
          this.featuresCoordinates[feature.properties.metadata.PID] =
            feature.geometry.coordinates
        })
      })
      // Change visible data
      if (this.map.getSource(POI_SOURCE)) {
        // Clean-up previous cluster markers
        this.markers = {}
        Object.values(this.markersOnScreen).forEach((marker) => marker.remove())
        this.markersOnScreen = {}

        // Change data
        const source = this.map.getSource(POI_SOURCE)
        if ('setData' in source) {
          source.setData({
            type: 'FeatureCollection',
            features: Object.values(features)
              .flat()
              .filter((f: VidoFeature) => f.properties.vido_visible),
          })
        }
      }
      // Create POI source + layer
      else {
        this.initPoiLayer(features)
      }

      // Zoom back to whole region if a new category is selected
      const oldCategories: string[] = Object.keys(oldFeatures)
      const newCategories: string[] = Object.keys(features)
      if (
        this.allowRegionBackZoom &&
        !deepEqual(newCategories, oldCategories) &&
        newCategories.find((c) => !oldCategories.includes(c))
      ) {
        this.resetMapview().then(() => {
          this.map?.flyTo({
            center: [this.center.lng, this.center.lat],
            zoom: this.zoom.default,
          })
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

      const style = this.mapStyle

      this.map.setStyle(style)

      this.map.once('styledata', () => {
        if (
          this.poiFilter &&
          (typeof style !== 'object' || !style.vido_israster) &&
          !this.isModeExplorer
        ) {
          this.poiFilter.remove(true)
        }

        if (
          this.isModeExplorer &&
          this.selectedBackground === EXPLORER_MAP_STYLE
        ) {
          this.poiFilterForExplorer()
        }
        this.initPoiLayer(this.features)
      })
    },

    mode() {
      switch (this.mode) {
        case Mode.EXPLORER:
          this.selectedBackground = EXPLORER_MAP_STYLE
          this.map?.setStyle(this.mapStyle)

          setHashPart('bg', this.selectedBackground)

          this.poiFilterForExplorer()
          break
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

    this.onMapPitchEnd = throttle(this.onMapPitchEnd, 300)
    this.onMapRender = throttle(this.onMapRender, 1000)
  },

  beforeMount() {
    const favorites =
      localStorage.getItem(LOCAL_STORAGE.favorites) || '{ "favorites": "[]" }'

    this.$store.dispatch(
      'favorite/toggleFavoriteModes',
      JSON.parse(favorites).favorites
    )

    this.$store.dispatch(
      'favorite/handleFavoriteLayer',
      getHashPart('fav') === 'y'
    )

    this.selectedBackground = getHashPart('bg') || DEFAULT_MAP_STYLE
  },

  methods: {
    ...mapActions({
      resetMapview: 'map/resetMapview',
    }),

    onMapInit(map: mapboxgl.Map) {
      this.map = map

      this.poiFilter = new PoiFilter()
      this.map.addControl(this.poiFilter)

      this.map.on('styledata', () => {
        if (!this.isModeExplorer) {
          this.poiFilter?.remove(true)
        } else {
          this.poiFilterForExplorer()
        }
      })

      this.map.on('load', () => {
        this.initPoiLayer(this.features)
      })

      this.map.on('click', () => {
        this.selectFeature(null)
        this.$emit('click')
      })

      // Listen to click on POI from vector tiles (explorer mode)
      this.map.on(
        'click',
        'poi-level-1',
        (event: MapLayerMouseEvent | MapLayerTouchEvent) => {
          this.selectFeature(event.features?.pop())
        }
      )

      this.map.on(
        'click',
        'poi-level-2',
        (event: MapLayerMouseEvent | MapLayerTouchEvent) => {
          this.selectFeature(event.features?.pop())
        }
      )

      this.map.on(
        'click',
        'poi-level-3',
        (event: MapLayerMouseEvent | MapLayerTouchEvent) => {
          this.selectFeature(event.features?.pop())
        }
      )

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
        const id = props?.metadata?.PID || props?.id
        const currentFavorites = localStorage.getItem(LOCAL_STORAGE.favorites)
        let newFavorite

        if (currentFavorites) {
          const parsedFavorites = JSON.parse(currentFavorites).favorites
          if (!parsedFavorites.includes(id)) {
            newFavorite = [...parsedFavorites, id]
          } else {
            newFavorite = parsedFavorites.filter((f: string) => f !== id)
          }
        } else {
          newFavorite = [id]
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

    async handleFavorites() {
      if (!this.map) {
        return
      }

      if (this.isModeFavorite) {
        this.resetMapview().then(() => {
          this.map?.flyTo({
            center: [this.center.lng, this.center.lat],
            zoom: this.zoom.default,
          })
        })

        const allFavorites = await this.fetchFavorites(this.favoritesIds)

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
          if ('setData' in source) {
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
          if (!this.map.getLayer(FAVORITE_LAYER_MARKER))
            this.map.addLayer(
              markerLayerFactory(FAVORITE_SOURCE, FAVORITE_LAYER_MARKER)
            )
        }
      } else {
        this.getSubCategory(this.selectedCategories)
      }
    },

    async fetchFavorites(ids) {
      return await getPoiByIds(this.$config.API_ENDPOINT, ids)
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

      this.map.fitBounds(bounds, { maxZoom: 13 })
    },

    poiFilterForExplorer() {
      this.poiFilter?.reset()

      const filters = Object.values(this.categories)
        .filter(
          (c) =>
            c.metadata.tourism_style_merge &&
            Array.isArray(c.metadata.tourism_style_class)
        )
        .map((c) => c.metadata.tourism_style_class)

      this.poiFilter?.setIncludeFilter(filters)
    },

    onClickChangeBackground(background: keyof typeof MapStyle) {
      this.selectedBackground = background
      this.map?.setStyle(this.mapStyle)
    },

    initPoiLayer(features: MenuState['features']) {
      if (!this.map) {
        return
      }

      // Create cluster properties, which will contain count of features per category
      const clusterProps: { [category: string]: object } = {}

      Object.keys(this.categories).forEach((category) => {
        clusterProps[category] = [
          '+',
          ['case', ['==', ['get', 'vido_cat'], parseInt(category, 10)], 1, 0],
        ]
      })

      if (!this.map.getSource(POI_SOURCE))
        this.map.addSource(POI_SOURCE, {
          type: 'geojson',
          cluster: true,
          clusterRadius: 64,
          clusterProperties: clusterProps,
          clusterMaxZoom: 15,
          data: {
            type: 'FeatureCollection',
            features: Object.values(features)
              .flat()
              .filter((f) => f.properties.vido_visible),
          },
        })

      // Add individual markers
      if (!this.map.getLayer(POI_LAYER_MARKER))
        this.map.addLayer(markerLayerFactory(POI_SOURCE, POI_LAYER_MARKER))
    },

    selectFeature(feature: VidoFeature) {
      this.$store.dispatch('map/selectFeature', feature)

      if (feature) {
        setTimeout(() => {
          this.map?.flyTo({
            center: feature.geometry.coordinates,
          })
        }, 500)
      }
    },

    updateMarkers(src) {
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

        if (props && props.cluster) {
          id = 'c' + props.cluster_id
          marker = this.markers[id]
          if (!marker) {
            const el = this.createMarkerDonutChart(props)
            marker = this.markers[id] = new mapboxgl.Marker({
              element: el,
            }).setLngLat(coords)
            el.addEventListener('click', (e) => {
              e.stopPropagation()
              if (!this.map) return

              const source = this.map.getSource(src)

              if ('getClusterExpansionZoom' in source) {
                source.getClusterExpansionZoom(
                  props.cluster_id,
                  (err: Error, zoom: number) => {
                    if (err) return
                    if (!this.map) return
                    this.map.easeTo({ center: coords, zoom: zoom + 2 })
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
          if (!marker) {
            // Marker
            const el: HTMLElement = document.createElement('div')
            el.classList.add('mapboxgl-marker')
            marker = this.markers[id] = new mapboxgl.Marker({
              element: el,
            }).setLngLat(this.featuresCoordinates[props.metadata.PID]) // Using this to avoid misplaced marker

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

    createMarkerDonutChart(
      props: mapboxgl.MapboxGeoJSONFeature['properties']
    ): HTMLElement {
      const offsets = []

      const countPerColor: { [color: string]: number } = {}
      Object.keys(this.categories)
        .filter((categoryId) => ((props && props[categoryId]) || 0) > 0)
        .forEach((categoryId) => {
          const color = this.categories[categoryId].metadata.color
          if (countPerColor[color]) {
            countPerColor[color] += (props && props[categoryId]) || 0
          } else {
            countPerColor[color] = (props && props[categoryId]) || 0
          }
        })

      const counts: number[] = Object.values(countPerColor)
      const colors = Object.keys(countPerColor)
      let total = 0
      for (let i = 0; i < counts.length; i++) {
        offsets.push(total)
        total += counts[i]
      }

      const r = total >= 1000 ? 40 : total >= 100 ? 32 : total >= 10 ? 24 : 16
      const r0 = r - 5
      const w = r * 2

      let html = `<svg width="${w}" height="${w}" viewbox="0 0 ${w} ${w}" text-anchor="middle" class="cluster-donut">`

      for (let i = 0; i < counts.length; i++) {
        html += this.getMarkerDonutSegment(
          offsets[i] / total,
          (offsets[i] + counts[i]) / total,
          r,
          r0,
          colors[i]
        )
      }
      html += `<circle cx="${r}" cy="${r}" r="${r0}" fill="white" />
        <text dominant-baseline="central" transform="translate(${r}, ${r})">
          ${total.toLocaleString()}
        </text>
      </svg>`

      const el = document.createElement('div')
      el.innerHTML = html
      return el
    },

    getMarkerDonutSegment(
      start: number,
      end: number,
      r: number,
      r0: number,
      color: string
    ): string {
      if (end - start === 1) end -= 0.00001
      const a0 = 2 * Math.PI * (start - 0.25)
      const a1 = 2 * Math.PI * (end - 0.25)
      const x0 = Math.cos(a0)
      const y0 = Math.sin(a0)
      const x1 = Math.cos(a1)
      const y1 = Math.sin(a1)
      const largeArc = end - start > 0.5 ? 1 : 0

      return [
        '<path d="M',
        r + r0 * x0,
        r + r0 * y0,
        'L',
        r + r * x0,
        r + r * y0,
        'A',
        r,
        r,
        0,
        largeArc,
        1,
        r + r * x1,
        r + r * y1,
        'L',
        r + r0 * x1,
        r + r0 * y1,
        'A',
        r0,
        r0,
        0,
        largeArc,
        0,
        r + r0 * x0,
        r + r0 * y0,
        '" fill="' + color + '" />',
      ].join(' ')
    },
  },
})
</script>

<style>
.cluster-donut {
  @apply text-sm leading-none font-medium block text-gray-800;
}
</style>
