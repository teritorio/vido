import { Store } from 'vuex'

import { SiteInfos, Mode } from '@/utils/types'

enum Mutation {
  SET_CONFIG = 'SET_CONFIG',
  SET_MODE = 'SET_MODE',
}

interface FetchConfigPayload {
  apiEndpoint: string
}

interface State {
  infos: SiteInfos
  isLoaded: boolean
  mode: Mode
}

export const state = (): State | null => ({
  infos: {},
  isLoaded: false,
  mode: Mode.BROWSER,
})

export const mutations = {
  [Mutation.SET_CONFIG](state: State, payload: SiteInfos) {
    state.infos = payload

    state.isLoaded = true
  },

  [Mutation.SET_MODE](state: State, mode: Mode) {
    state.mode = mode
  },
}

export const actions = {
  async fetchConfig(store: Store<State>, { apiEndpoint }: FetchConfigPayload) {
    try {
      const configPromise = await fetch(`${apiEndpoint}/geodata/v0.1/site`)
      const config = await configPromise.json()

      store.commit(Mutation.SET_CONFIG, config)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        'Vido error: Unable to fetch the site config from the API',
        error
      )
    }
  },

  setMode(store: Store<State>, mode: Mode) {
    store.commit(Mutation.SET_MODE, mode)
  },
}

export const getters = {
  all: (state: State) => state,
  infos: (state: State) => (lang: string) => state.infos[lang],
  isLoaded: (state: State) => state.isLoaded,
  mode: (state: State) => state.mode,
}
