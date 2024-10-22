import { defineStore } from 'pinia'
import { type LngLatLike, type Marker, Point } from 'maplibre-gl'
import type { TeritorioCluster } from '@teritorio/maplibre-gl-teritorio-cluster'
import type { ApiPoi, ApiPoiProperties } from '~/lib/apiPois'
import type { LatLng, Pitch } from '~/utils/types'
import { Mode } from '~/utils/types'
import { pinMarkerRender } from '~/lib/clusters'

interface State {
  center: LatLng
  mode: Mode
  pinMarker: Marker | null
  pitch: Pitch
  selectedFeature: ApiPoi | null
  teritorioCluster: TeritorioCluster | null
}

export const mapStore = defineStore('map', {
  state: (): State => ({
    center: { lng: 0, lat: 0 },
    mode: Mode.BROWSER,
    pinMarker: null,
    pitch: 0,
    selectedFeature: null,
    teritorioCluster: null,
  }),

  getters: {
    isModeExplorer: state => state.mode === Mode.EXPLORER,
    isModeFavorites: state => state.mode === Mode.FAVORITES,
    isModeExplorerOrFavorites: state =>
      state.mode === Mode.EXPLORER || state.mode === Mode.FAVORITES,
  },

  actions: {
    setSelectedFeature(feature: ApiPoi | null) {
      this.pinMarker?.remove()
      this.pinMarker = null

      if (!feature) {
        this.selectedFeature = null
        this.teritorioCluster?.resetSelectedFeature()
      }
      else {
        const goodFeature = feature

        function isJsonObject(item: string): boolean {
          let value = false
          try {
            value = JSON.parse(item)
          }
          catch (e) {
            return false
          }

          return typeof value === 'object' && value !== null
        }

        if (feature?.properties) {
          const cleanProperties: ApiPoiProperties = {} as ApiPoiProperties

          Object.keys(feature.properties).forEach((key) => {
            if (isJsonObject(feature.properties[key]))
              cleanProperties[key] = JSON.parse(feature.properties[key])
            else cleanProperties[key] = feature.properties[key]
          })

          goodFeature.properties = cleanProperties

          if (feature.properties.internalType === 'address') {
            const { coordinates } = feature.geometry as GeoJSON.Point
            // @ts-expect-error: type is too deep
            this.pinMarker = pinMarkerRender(coordinates as LngLatLike, new Point(0, 0))
            this.teritorioCluster?.resetSelectedFeature()
          }
        }

        this.selectedFeature = goodFeature
      }
    },
  },
})
