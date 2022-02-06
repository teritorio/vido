import { Store } from 'vuex'

import { LatLng, Pitch, VidoFeature } from '@/utils/types'

enum Mutation {
  SET_CONFIG = 'SET_CONFIG',
  SELECT_FEATURE = 'SELECT_FEATURE',
  SET_CENTER = 'SET_CENTER',
}

interface State {
  center: LatLng
  pitch: Pitch
  selectedFeature: string | null
  // eslint-disable-next-line camelcase
}

const getInitialMapview: Function = () => ({
  center: [0, 0],
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
  selectedFeature: (state: State) =>
    state.selectedFeature && JSON.parse(state.selectedFeature),
}
