<template>
  <div class="w-full h-full">
    <div class="relative flex flex-col w-full h-full">
      <div id="map" class="flex-grow overflow-hidden">
        <mapbox
          access-token=""
          :map-options="{
            center: [center.lng, center.lat],
            hash: false,
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
          @map-render="onMapRender"
        />
      </div>

      <MapControls
        :map="map"
        :pitch="pitch"
        :backgrounds="availableStyles"
        @changeBackground="onClickChangeBackground"
      />

      <div
        class="absolute flex justify-center inset-x-3 bottom-3 pointer-events-none"
      >
        <MapPoiToast
          v-if="selectedFeature"
          :poi="selectedFeature"
          class="flex-grow-0"
          @click="onPoiToastClick"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PoiFilter } from '@teritorio/map'
import throttle from 'lodash.throttle'
import mapboxgl from 'mapbox-gl'
import Mapbox from 'mapbox-gl-vue'
import Vue from 'vue'
import { mapGetters } from 'vuex'

import MapControls from '@/components/MapControls.vue'
import MapPoiToast from '@/components/MapPoiToast.vue'
import { State as MenuState } from '@/store/menu'
import { getContrastedTextColor } from '@/utils/picto'
// import { Category } from '@/utils/types'

const POI_SOURCE = 'poi'
const POI_LAYER_MARKER = 'poi-simple-marker'
const MAP_STYLES = {
  'tourism-0.9': 'Teritorio Tourisme (0.9)',
  'tourism-proxy': 'Teritorio Tourisme (proxy)',
  mapnik: 'OpenStreetMap',
}

export default Vue.extend({
  components: {
    Mapbox,
    MapControls,
    MapPoiToast,
  },

  data(): {
    map: mapboxgl.Map | null
    pitch: number
    markers: object
    markersOnScreen: object
    poiFilter: mapboxgl.Control | null
    selectedFeature: object | null
    selectedFeatureMarker: mapboxgl.Marker | null
    selectedBackground: String
  } {
    return {
      map: null,
      pitch: 0,
      markers: {},
      markersOnScreen: {},
      poiFilter: null,
      selectedFeature: null,
      selectedMarker: null,
      selectedBackground: 'tourism-0.9',
    }
  },

  computed: {
    ...mapGetters({
      categories: 'menu/categories',
      center: 'map/center',
      features: 'menu/features',
      zoom: 'map/zoom',
    }),

    mapStyle(): string | Object {
      switch (this.selectedBackground) {
        case 'tourism-0.9':
          return `https://vecto-dev.teritorio.xyz/styles/teritorio-tourism-0.9/style.json?key=${this.$config.TILES_TOKEN}`

        case 'mapnik':
          return {
            version: 8,
            name: 'Teritorio Mapnik',
            sprite: `https://vecto-dev.teritorio.xyz/styles/teritorio-tourism-proxy/sprite?key=${this.$config.TILES_TOKEN}`,
            glyphs: `https://vecto-dev.teritorio.xyz/fonts/{fontstack}/{range}.pbf?key=${this.$config.TILES_TOKEN}`,
            vido_israster: true,
            sources: {
              mapnik: {
                type: 'raster',
                tiles: [
                  // 'https://tile.openstreetmap.org/{z}/{x}/{y}.png' // Main OSM tiles
                  'https://a.tiles.teritorio.xyz/styles/osm/{z}/{x}/{y}.png',
                  'https://b.tiles.teritorio.xyz/styles/osm/{z}/{x}/{y}.png',
                  'https://c.tiles.teritorio.xyz/styles/osm/{z}/{x}/{y}.png',
                ],
                tileSize: 256,
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
          }

        case 'tourism-proxy':
        default:
          return `https://vecto-dev.teritorio.xyz/styles/teritorio-tourism-proxy/style.json?key=${this.$config.TILES_TOKEN}`
      }
    },

    availableStyles() {
      return MAP_STYLES
    },
  },

  watch: {
    features(features: MenuState['features']) {
      if (!this.map) {
        return
      }

      // Add category ID into features
      Object.keys(features).forEach((categoryId) => {
        features[categoryId].forEach(
          (feature) => (feature.properties.vido_cat = categoryId)
        )
      })

      // Change visible data
      if (this.map.getSource(POI_SOURCE)) {
        // Clean-up previous cluster markers
        this.markers = {}
        Object.values(this.markersOnScreen).forEach((marker) => marker.remove())
        this.markersOnScreen = {}

        // Change data
        this.map.getSource(POI_SOURCE).setData({
          type: 'FeatureCollection',
          features: Object.values(features).flat(),
        })
      }
      // Create POI source + layer
      else {
        this.initPoiLayer(features)
      }
    },

    selectedFeature(feature: Object) {
      // Clean-up previous marker
      if (this.selectedFeatureMarker) {
        this.selectedFeatureMarker.remove()
        this.selectedFeatureMarker = null
      }

      // Add new marker if a feature is selected
      if (feature) {
        this.selectedFeatureMarker = new mapboxgl.Marker({
          scale: 1.3,
          color: '#f44336',
        })
          .setLngLat(feature.geometry.coordinates)
          .addTo(this.map)
      }
    },

    selectedBackground() {
      this.map.setStyle(this.mapStyle)
      this.map.once('styledata', () => {
        if (typeof this.mapStyle !== 'object' || !this.mapStyle.vido_israster) {
          this.poiFilter.remove(true)
        }
        this.initPoiLayer(this.features)
      })
    },
  },

  created() {
    this.pitch = this.$store.getters['map/pitch']

    this.onMapPitchEnd = throttle(this.onMapPitchEnd, 300)
    this.onMapRender = throttle(this.onMapRender, 300)
  },

  methods: {
    onMapInit(map: mapboxgl.Map) {
      this.map = map

      this.poiFilter = new PoiFilter()
      this.map.addControl(this.poiFilter)
      this.map.on('load', () => this.poiFilter.remove(true))

      // Handle POI click
      this.map.on('click', (e) => {
        const features = this.map.queryRenderedFeatures(e.point, {
          layers: [POI_LAYER_MARKER],
        })

        if (
          features.length > 0 &&
          features[0].properties.metadata &&
          typeof features[0].properties.metadata === 'string'
        ) {
          features[0].properties.metadata = JSON.parse(
            features[0].properties.metadata
          )
        }

        if (
          features.length === 1 &&
          features[0].properties.metadata.HasPopup === 'yes'
        ) {
          this.selectedFeature = features[0]
        } else {
          this.selectedFeature = null
        }
      })
    },

    onMapPitchEnd(map: mapboxgl.Map) {
      this.pitch = map.getPitch()
    },

    onMapRender() {
      if (
        !this.map.getSource(POI_SOURCE) ||
        !this.map.isSourceLoaded(POI_SOURCE)
      )
        return
      this.updateMarkers()
    },

    onPoiToastClick() {
      if (!this.map || !this.selectedFeature) {
        return
      }
      this.map.flyTo({
        center: this.selectedFeature.geometry.coordinates,
        zoom: 15,
      })
    },

    onClickChangeBackground(background: String) {
      this.selectedBackground = background
    },

    initPoiLayer(features) {
      // Create cluster properties, which will contain count of features per category
      const clusterProps = {}
      Object.keys(this.categories).forEach((category) => {
        clusterProps[category] = [
          '+',
          ['case', ['==', ['get', 'vido_cat'], category], 1, 0],
        ]
      })

      this.map.addSource(POI_SOURCE, {
        type: 'geojson',
        cluster: true,
        clusterRadius: 50,
        clusterProperties: clusterProps,
        data: {
          type: 'FeatureCollection',
          features: Object.values(features).flat(),
        },
      })

      // Add individual markers
      this.map.addLayer({
        id: POI_LAYER_MARKER,
        type: 'symbol',
        source: POI_SOURCE,
        filter: ['!=', 'cluster', true],
        paint: {
          'icon-color': [
            'match',
            ['get', 'vido_cat'],
            ...Object.entries(this.categories)
              .map((c) => [c[0], getContrastedTextColor(c[1].metadata.color)])
              .flat(),
            'white',
          ],
          'text-color': [
            'match',
            [
              'at',
              0,
              [
                'array',
                ['get', 'tourism_style_class', ['object', ['get', 'metadata']]],
              ],
            ],
            'products',
            '#F25C05',
            'convenience',
            '#00a0a4',
            'services',
            '#2a62ac',
            'safety',
            '#e42224',
            'mobility',
            '#3b74b9',
            'amenity',
            '#2a62ac',
            'remarkable',
            '#e50980',
            'culture',
            '#76009e',
            'hosting',
            '#99163a',
            'catering',
            '#f09007',
            'leisure',
            '#00A757',
            'public_landmark',
            '#1D1D1B',
            'shopping',
            '#808080',
            '#666',
          ],
          'text-halo-blur': 0.5,
          'text-halo-color': '#ffffff',
          'text-halo-width': 1,
          'text-opacity': ['interpolate', ['linear'], ['zoom'], 14, 0, 15, 1],
        },
        layout: {
          'icon-image': [
            'concat',
            [
              'at',
              0,
              [
                'array',
                ['get', 'tourism_style_class', ['object', ['get', 'metadata']]],
              ],
            ],
            [
              'case',
              [
                '>=',
                [
                  'length',
                  [
                    'array',
                    [
                      'get',
                      'tourism_style_class',
                      ['object', ['get', 'metadata']],
                    ],
                  ],
                ],
                2,
              ],
              [
                'concat',
                '-',
                [
                  'at',
                  1,
                  [
                    'array',
                    [
                      'get',
                      'tourism_style_class',
                      ['object', ['get', 'metadata']],
                    ],
                  ],
                ],
              ],
              '',
            ],
            [
              'case',
              [
                '>=',
                [
                  'length',
                  [
                    'array',
                    [
                      'get',
                      'tourism_style_class',
                      ['object', ['get', 'metadata']],
                    ],
                  ],
                ],
                3,
              ],
              [
                'concat',
                '-',
                [
                  'at',
                  2,
                  [
                    'array',
                    [
                      'get',
                      'tourism_style_class',
                      ['object', ['get', 'metadata']],
                    ],
                  ],
                ],
              ],
              '',
            ],
            '⬤',
          ],
          'icon-size': 1,
          'text-anchor': 'top',
          'text-field': ['get', 'name'],
          'text-font': ['Noto Sans Regular'],
          'text-max-width': 9,
          'text-offset': [0, 1.3],
          'text-padding': 2,
          'text-size': 12,
          'text-optional': true,
          'text-allow-overlap': false,
        },
      })
    },

    updateMarkers() {
      const newMarkers = {}
      const features = this.map.querySourceFeatures(POI_SOURCE)

      // for every cluster on the screen, create an HTML marker for it (if we didn't yet),
      // and add it to the map if it's not there already
      for (let i = 0; i < features.length; i++) {
        const coords = features[i].geometry.coordinates
        const props = features[i].properties
        if (!props.cluster) continue
        const id = props.cluster_id

        let marker = this.markers[id]
        if (!marker) {
          const el = this.createMarkerDonutChart(props)
          marker = this.markers[id] = new mapboxgl.Marker({
            element: el,
          }).setLngLat(coords)
          marker.getElement().addEventListener('click', () => {
            this.map
              .getSource(POI_SOURCE)
              .getClusterExpansionZoom(id, (err, zoom) => {
                if (err) return
                this.map.easeTo({ center: coords, zoom })
              })
          })
        }
        newMarkers[id] = marker

        if (!this.markersOnScreen[id]) marker.addTo(this.map)
      }
      // for every marker we've added previously, remove those that are no longer visible
      for (const id in this.markersOnScreen) {
        if (!newMarkers[id]) this.markersOnScreen[id].remove()
      }
      this.markersOnScreen = newMarkers
    },

    createMarkerDonutChart(props) {
      const offsets = []

      const countPerColor = {}
      Object.keys(this.categories)
        .filter((categoryId) => props[categoryId] > 0)
        .forEach((categoryId) => {
          const color = this.categories[categoryId].metadata.color
          if (countPerColor[color]) {
            countPerColor[color] += props[categoryId]
          } else {
            countPerColor[color] = props[categoryId]
          }
        })
      const counts = Object.values(countPerColor)
      const colors = Object.keys(countPerColor)

      let total = 0
      for (let i = 0; i < counts.length; i++) {
        offsets.push(total)
        total += counts[i]
      }
      const fontSize =
        total >= 1000 ? 22 : total >= 100 ? 20 : total >= 10 ? 18 : 16
      const r = total >= 1000 ? 50 : total >= 100 ? 32 : total >= 10 ? 24 : 18
      const r0 = Math.round(r * 0.6)
      const w = r * 2

      let html =
        '<div><svg width="' +
        w +
        '" height="' +
        w +
        '" viewbox="0 0 ' +
        w +
        ' ' +
        w +
        '" text-anchor="middle" style="font-size: ' +
        fontSize +
        'px; display: block">'

      for (let i = 0; i < counts.length; i++) {
        html += this.getMarkerDonutSegment(
          offsets[i] / total,
          (offsets[i] + counts[i]) / total,
          r,
          r0,
          colors[i]
        )
      }
      html +=
        '<circle cx="' +
        r +
        '" cy="' +
        r +
        '" r="' +
        r0 +
        '" fill="white" /><text dominant-baseline="central" transform="translate(' +
        r +
        ', ' +
        r +
        ')">' +
        total.toLocaleString() +
        '</text></svg></div>'

      const el = document.createElement('div')
      el.innerHTML = html
      return el.firstChild
    },

    getMarkerDonutSegment(start, end, r, r0, color) {
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
