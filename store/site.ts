import { Store } from 'vuex'

import { Mode } from '@/utils/types'

enum Mutation {
  SET_LOCALE = 'SET_LOCALE',
  SET_MODE = 'SET_MODE',
}

interface State {
  isLoaded: boolean
  locale: string | null
  mode: Mode
}

export const state = (): State | null => ({
  isLoaded: false,
  locale: null,
  mode: Mode.BROWSER,
})

export const mutations = {
  [Mutation.SET_LOCALE](state: State, locale: string) {
    state.locale = locale
  },
  [Mutation.SET_MODE](state: State, mode: Mode) {
    state.mode = mode
  },
}

export const actions = {
  setLocale(store: Store<State>, locale: string) {
    store.commit(Mutation.SET_LOCALE, locale)
  },
  setMode(store: Store<State>, mode: Mode) {
    store.commit(Mutation.SET_MODE, mode)
  },
}

export const getters = {
  all: (state: State) => state,
  isLoaded: (state: State) => state.isLoaded,
  locale: (state: State) => state.locale,
  mode: (state: State) => state.mode,
}
