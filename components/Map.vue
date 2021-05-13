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
        />
      </div>

      <MapControls :map="map" :pitch="pitch" />

      <!-- <div class="absolute flex justify-center inset-x-3 bottom-3">
      <MapPoiToast class="flex-grow-0" />
    </div> -->
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

// import MapPoiToast from '@/components/MapPoiToast.vue'
import MapControls from '@/components/MapControls.vue'
import { State as MenuState } from '@/store/menu'
import { getContrastedTextColor, getPicto } from '@/utils/picto'

import { Category } from '~/utils/types'

export default Vue.extend({
  components: {
    Mapbox,
    MapControls,
    // MapPoiToast,
  },
  data(): {
    map: mapboxgl.Map | null
    pitch: number
  } {
    return {
      map: null,
      pitch: 0,
    }
  },
  computed: {
    ...mapGetters({
      categories: 'menu/categories',
      center: 'map/center',
      features: 'menu/features',
      zoom: 'map/zoom',
    }),
    mapStyle(): string {
      // return `https://vecto.teritorio.xyz/styles/teritorio-tourism-latest/style.json?key=${this.$config.TILES_TOKEN}`
      return `https://vecto-dev.teritorio.xyz/styles/teritorio-tourism-proxy/style.json?key=${this.$config.TILES_TOKEN}`
    },
  },
  watch: {
    features(features: MenuState['features']) {
      Object.keys(features).forEach((categoryId) => {
        const category: Category = this.categories[categoryId]

        // console.log(this.categories[categoryId])
        // console.log(features[categoryId])

        if (!this.map) {
          return
        }

        const mapCanvas = this.map.getCanvas()
        const mapCanvasContainer = this.map.getCanvasContainer()
        const markerSize = '2rem'
        const pictoSize = '1rem'

        // const sourceId = `category-${categoryId}`
        // const layerId = sourceId

        // this.map.addSource(sourceId, {
        //   type: 'geojson',
        //   data: {
        //     type: 'FeatureCollection',
        //     features: features[categoryId],
        //   },
        // })

        // // var features = map.querySourceFeatures('earthquakes');

        // this.map.addLayer({
        //   id: layerId,
        //   type: 'symbol',
        //   source: sourceId,
        //   layout: {
        //     'icon-image': 'rocket-15',
        //     // 'icon-image': '{icon}',
        //     'icon-allow-overlap': true,
        //   },
        // })

        // // When a click event occurs on a feature in the places layer, open a popup at the
        // // location of the feature, with description HTML from its properties.
        // this.map.on('click', 'places', function (e) {
        //   const coordinates = e.features[0].geometry.coordinates.slice()
        //   const description = e.features[0].properties.description

        //   // Ensure that if the map is zoomed out such that multiple
        //   // copies of the feature are visible, the popup appears
        //   // over the copy being pointed to.
        //   while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        //     coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
        //   }

        //   new mapboxgl.Popup()
        //     .setLngLat(coordinates)
        //     .setHTML(description)
        //     .addTo(map)
        // })

        // // Change the cursor to a pointer when the mouse is over the places layer.
        // this.map.on('mouseenter', 'places', function () {
        //   map.getCanvas().style.cursor = 'pointer'
        // })

        // // Change it back to a pointer when it leaves.
        // this.map.on('mouseleave', 'places', function () {
        //   map.getCanvas().style.cursor = ''
        // })

        features[categoryId].forEach((feature) => {
          if (!this.map) {
            return
          }

          const el = document.createElement('div')
          el.style.backgroundColor = category.metadata.color
          el.style.width = markerSize
          el.style.height = markerSize
          el.style.display = 'flex'
          el.style.justifyContent = 'center'
          el.style.alignItems = 'center'
          el.style.borderRadius = '50%'

          el.innerHTML = getPicto(category.metadata.picto, 'raw')
          el.style.color = getContrastedTextColor(category.metadata.color)

          const picto = el.querySelector('svg')

          if (picto) {
            picto.style.fill = 'currentColor'
            picto.style.width = pictoSize
            picto.style.height = pictoSize
          }

          new mapboxgl.Marker(el)
            .setLngLat(feature.geometry.coordinates)
            .setPopup(
              new mapboxgl.Popup()
                .setLngLat(feature.geometry.coordinates)
                .setHTML(feature.properties.post_title)
            )
            .addTo(this.map)

          el.addEventListener('mouseenter', () => {
            if (this.map) {
              mapCanvasContainer.style.cursor = 'pointer'
              mapCanvas.style.cursor = 'pointer'
            }
          })

          el.addEventListener('mouseleave', () => {
            if (this.map) {
              mapCanvasContainer.style.cursor = ''
              mapCanvas.style.cursor = ''
            }
          })
        })
      })
    },
  },
  created() {
    this.pitch = this.$store.getters['map/pitch']

    this.onMapPitchEnd = throttle(this.onMapPitchEnd, 300)
  },
  methods: {
    onMapInit(map: mapboxgl.Map) {
      this.map = map

      this.map.addControl(
        new PoiFilter({
          filter: [
            // ['catering', 'food', 'restaurant'],
            // ['leisure', 'park'],
          ],
          include: true,
        })
      )
    },
    onMapPitchEnd(map: mapboxgl.Map) {
      this.pitch = map.getPitch()
    },
  },
})
</script>

<style>
.mapboxgl-marker svg,
.mapboxgl-marker svg g,
.mapboxgl-marker svg path {
  fill: currentColor;
}
</style>
