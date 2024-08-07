import { defineStore } from 'pinia'
import type { ApiPoi, ApiPoiProperties } from '~/lib/apiPois'
import type { LatLng, Pitch } from '~/utils/types'
import { Mode } from '~/utils/types'

interface State {
  center: LatLng
  mode: Mode
  pitch: Pitch
  selectedFeature: ApiPoi | null
}

export const mapStore = defineStore('map', {
  state: (): State => ({
    center: { lng: 0, lat: 0 },
    mode: Mode.BROWSER,
    pitch: 0,
    selectedFeature: null,
  }),

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
        }

        this.selectedFeature = goodFeature
      }
    },
  },
})
