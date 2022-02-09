import { Store } from 'vuex'

import { Mode } from '@/utils/types'

enum Mutation {
  SET_CONFIG = 'SET_CONFIG',
  SET_MODE = 'SET_MODE',
}

interface State {
  isLoaded: boolean
  mode: Mode
}

export const state = (): State | null => ({
  isLoaded: false,
  mode: Mode.BROWSER,
})

export const mutations = {
  [Mutation.SET_MODE](state: State, mode: Mode) {
    state.mode = mode
  },
}

export const actions = {
  setMode(store: Store<State>, mode: Mode) {
    store.commit(Mutation.SET_MODE, mode)
  },
}

export const getters = {
  all: (state: State) => state,
  isLoaded: (state: State) => state.isLoaded,
  mode: (state: State) => state.mode,
}
