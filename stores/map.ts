import { defineStore } from 'pinia'

import type { ApiPoi, ApiPoiProperties } from '~/lib/apiPois'
import type { LatLng, Pitch } from '~/utils/types'
import { Mode } from '~/utils/types'

interface State {
  center: LatLng
  pitch: Pitch
  selectedFeature: ApiPoi | null
  mode: Mode
}

const getInitialMapview: () => {
  center: {
    lng: number
    lat: number
  }
} = () => ({
  center: { lng: 0, lat: 0 },
})

export const mapStore = defineStore('map', {
  state: (): State =>
    Object.assign(
      {
        pitch: 0,
        selectedFeature: null,
        mode: Mode.BROWSER,
      },
      getInitialMapview(),
    ),

  getters: {
    isModeExplorer: (state: State) => state.mode === Mode.EXPLORER,
    isModeFavorites: (state: State) => state.mode === Mode.FAVORITES,
    isModeExplorerOrFavorites: (state: State) =>
      state.mode === Mode.EXPLORER || state.mode === Mode.FAVORITES,
  },

  actions: {
    setSelectedFeature(feature: ApiPoi | null) {
      if (!feature) {
        this.selectedFeature = null
      }
      else {
        const goodFeature = feature

        const IsJsonString = (str: string) => {
          try {
            JSON.parse(str)
          }
          catch (e) {
            return false
          }
          return true
        }

        if (feature?.properties) {
          const cleanProperties: { [key: string]: any } = {}

          Object.keys(feature.properties).forEach((key) => {
            if (IsJsonString(feature.properties[key]))
              cleanProperties[key] = JSON.parse(feature.properties[key])
            else
              cleanProperties[key] = feature.properties[key]
          })

          goodFeature.properties = cleanProperties as ApiPoiProperties
        }

        this.selectedFeature = goodFeature
      }
    },
  },
})
