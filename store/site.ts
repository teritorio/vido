import { Store } from 'vuex'

enum Mutation {
  SET_LOCALE = 'SET_LOCALE',
}

export interface State {
  locale: string | null
}

export const state = (): State | null => ({
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
  locale: (state: State) => state.locale,
}
