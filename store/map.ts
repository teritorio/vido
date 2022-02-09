import { Store } from 'vuex'

import { LatLng, Pitch, ZoomLevel, VidoFeature } from '@/utils/types'

enum Mutation {
  SET_CONFIG = 'SET_CONFIG',
  SELECT_FEATURE = 'SELECT_FEATURE',
  SET_CENTER = 'SET_CENTER',
}

interface State {
  center: LatLng
  pitch: Pitch
  zoom: {
    default: ZoomLevel
    max: ZoomLevel
    min: ZoomLevel
  }
  selectedFeature: string | null
  // eslint-disable-next-line camelcase
  selection_zoom: {
    // eslint-disable-next-line camelcase
    zoom_ban: number
    // eslint-disable-next-line camelcase
    zoom_commune: number
  }
}

const getInitialMapview: Function = () => ({
  center: [0, 0],
  zoom: {
    default: 8,
    max: 20,
    min: 1,
  },
  selection_zoom: {
    zoom_ban: 15,
    zoom_commune: 12,
  },
})

export const state = (): State | null =>
  Object.assign(
    {
      pitch: 0,
      selectedFeature: null,
    },
    getInitialMapview()
  )

export const mutations = {
  [Mutation.SET_CONFIG](state: State, payload: State) {
    state.center = payload.center
    state.pitch = payload.pitch || 0
    state.zoom = payload.zoom
    state.selection_zoom = payload.selection_zoom
  },
  [Mutation.SELECT_FEATURE](state: State, payload: State) {
    // JSON conversion necessary to have map watcher working
    state.selectedFeature =
      payload.selectedFeature && JSON.stringify(payload.selectedFeature)
  },
  [Mutation.SET_CENTER](state: State, payload: State) {
    // JSON conversion necessary to have map watcher working
    state.center = payload.center
  },
}

export const actions = {
  selectFeature(store: Store<State>, feature: VidoFeature) {
    store.commit(Mutation.SELECT_FEATURE, { selectedFeature: feature })
  },
  center(store: Store<State>, center: LatLng) {
    store.commit(Mutation.SET_CENTER, { center })
  },
}

export const getters = {
  all: (state: State) => state,
  center: (state: State) => state.center,
  pitch: (state: State) => state.pitch,
  zoom: (state: State) => state.zoom,
  selectionZoom: (state: State) => state.selection_zoom,
  selectedFeature: (state: State) =>
    state.selectedFeature && JSON.parse(state.selectedFeature),
}
