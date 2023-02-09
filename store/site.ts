import { Store } from 'vuex'

import { VidoConfig } from '~/utils/types-config'

enum Mutation {
  SET_LOCALE = 'SET_LOCALE',
  SET_VIDO_CONFIG = 'SET_VIDO_CONFIG',
}

export interface State {
  locale: string | null
  config: VidoConfig | undefined
}

export const state = (): State | null => ({
  locale: null,
  config: undefined,
})

export const mutations = {
  [Mutation.SET_LOCALE](state: State, locale: string) {
    state.locale = locale
  },
  [Mutation.SET_VIDO_CONFIG](state: State, config: VidoConfig) {
    state.config = config
  },
}

export const actions = {
  setLocale(store: Store<State>, locale: string) {
    store.commit(Mutation.SET_LOCALE, locale)
  },

  setConfig(store: Store<State>, config: VidoConfig) {
    store.commit(Mutation.SET_VIDO_CONFIG, config)
  },
}

export const getters = {
  all: (state: State) => state,
  locale: (state: State) => state.locale,
  config: (state: State) => state.config,
}
