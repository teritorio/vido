import { Store } from 'vuex'

enum Mutation {
  SET_LOCALE = 'SET_LOCALE',
}

interface State {
  isLoaded: boolean
  locale: string | null
}

export const state = (): State | null => ({
  isLoaded: false,
  locale: null,
})

export const mutations = {
  [Mutation.SET_LOCALE](state: State, locale: string) {
    state.locale = locale
  },
}

export const actions = {
  setLocale(store: Store<State>, locale: string) {
    store.commit(Mutation.SET_LOCALE, locale)
  },
}

export const getters = {
  all: (state: State) => state,
  isLoaded: (state: State) => state.isLoaded,
  locale: (state: State) => state.locale,
}
