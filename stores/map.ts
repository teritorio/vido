import { defineStore } from 'pinia'
import type { FitBoundsOptions } from 'maplibre-gl'
import type { TeritorioCluster } from '@teritorio/maplibre-gl-teritorio-cluster'
import type { ApiPoi, ApiPoiProperties } from '~/lib/apiPois'
import type { LatLng, Pitch } from '~/utils/types'
import { Mode } from '~/utils/types'

interface State {
  boundOptions?: FitBoundsOptions
  center: LatLng
  mode: Mode
  pitch: Pitch
  selectedFeature: ApiPoi | null
  selectedFeatureDepsIDs: number[]
  teritorioCluster: TeritorioCluster | null
  isDepsView: boolean
}

export const mapStore = defineStore('map', {
  state: (): State => ({
    boundOptions: undefined,
    center: { lng: 0, lat: 0 },
    mode: Mode.BROWSER,
    pitch: 0,
    selectedFeature: null,
    selectedFeatureDepsIDs: [],
    teritorioCluster: null,
    isDepsView: false,
  }),

  getters: {
    isModeExplorer: state => state.mode === Mode.EXPLORER,
    isModeFavorites: state => state.mode === Mode.FAVORITES,
    isModeExplorerOrFavorites: state =>
      state.mode === Mode.EXPLORER || state.mode === Mode.FAVORITES,
  },

  actions: {
    setIsDepsView(state: boolean): void {
      this.isDepsView = state
    },
    setSelectedFeatureDepsIDs(ids?: number[]): void {
      this.selectedFeatureDepsIDs = ids || []
    },
    addSelectedFeatureDepsIDs(id: number): void {
      this.selectedFeatureDepsIDs.push(id)
    },
    setSelectedFeature(feature?: ApiPoi) {
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

        if (feature.properties) {
          const cleanProperties: ApiPoiProperties = {} as ApiPoiProperties

          Object.keys(feature.properties).forEach((key) => {
            if (isJsonObject(feature.properties[key]))
              cleanProperties[key] = JSON.parse(feature.properties[key])
            else cleanProperties[key] = feature.properties[key]
          })

          goodFeature.properties = cleanProperties
        }

        this.selectedFeature = goodFeature
      }
    },
  },
})
