import { Store } from 'vuex'

import { ApiPoi, ApiPoiProperties } from '~/lib/apiPois'
import { LatLng, Pitch, Mode } from '~/utils/types'

enum Mutation {
  SET_CONFIG = 'SET_CONFIG',
  SET_SELECTED_FEATURE = 'SET_SELECTED_FEATURE',
  SET_CENTER = 'SET_CENTER',
  SET_MODE = 'SET_MODE',
}

interface State {
  center: LatLng
  pitch: Pitch
  selectedFeature: string | null // ApiPoi
  mode: Mode
}

const getInitialMapview: Function = () => ({
  center: { lng: 0, lat: 0 },
})

export const state = (): State | null =>
  Object.assign(
    {
      pitch: 0,
      selectedFeature: null,
      mode: Mode.BROWSER,
    },
    getInitialMapview()
  )

export const mutations = {
  [Mutation.SET_CONFIG](state: State, payload: State) {
    state.center = payload.center
    state.pitch = payload.pitch || 0
  },
  [Mutation.SET_SELECTED_FEATURE](state: State, payload: State) {
    // JSON conversion necessary to have map watcher working
    state.selectedFeature =
      payload.selectedFeature && JSON.stringify(payload.selectedFeature)
  },
  [Mutation.SET_CENTER](state: State, payload: State) {
    // JSON conversion necessary to have map watcher working
    state.center = payload.center
  },
  [Mutation.SET_MODE](state: State, mode: Mode) {
    state.mode = mode
  },
}

export const actions = {
  setSelectedFeature(store: Store<State>, feature: ApiPoi) {
    if (!feature) {
      store.commit(Mutation.SET_SELECTED_FEATURE, { selectedFeature: null })
    } else {
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
        const cleanProperties: { [key: string]: any } = {}

        Object.keys(feature.properties).forEach((key) => {
          if (IsJsonString(feature.properties[key])) {
            cleanProperties[key] = JSON.parse(feature.properties[key])
          } else {
            cleanProperties[key] = feature.properties[key]
          }
        })

        goodFeature.properties = cleanProperties as ApiPoiProperties
      }

      store.commit(Mutation.SET_SELECTED_FEATURE, {
        selectedFeature: goodFeature,
      })
    }
  },
  center(store: Store<State>, center: LatLng) {
    store.commit(Mutation.SET_CENTER, { center })
  },
  setMode(store: Store<State>, mode: Mode) {
    store.commit(Mutation.SET_MODE, mode)
  },
}

export const getters = {
  all: (state: State) => state,
  center: (state: State) => state.center,
  pitch: (state: State) => state.pitch,
  selectedFeature: (state: State): ApiPoi =>
    state.selectedFeature && JSON.parse(state.selectedFeature),
  mode: (state: State) => state.mode,
  isModeExplorer: (state: State) => state.mode === Mode.EXPLORER,
  isModeFavorites: (state: State) => state.mode === Mode.FAVORITES,
  isModeExplorerOrFavorites: (state: State) =>
    state.mode === Mode.EXPLORER || state.mode === Mode.FAVORITES,
}
