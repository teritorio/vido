import { Store } from 'vuex'

import { SiteInfos } from '@/utils/types'

enum Mutation {
  SET = 'SET',
}

interface State {
  infos: SiteInfos
  isLoaded: boolean
}

export const state = (): State | null => ({
  infos: {},
  isLoaded: false,
})

export const mutations = {
  [Mutation.SET](state: State, payload: SiteInfos) {
    state.infos = payload

    state.isLoaded = true
  },
}

export const actions = {
  async fetch(store: Store<State>, apiOrigin: string) {
    try {
      const configPromise = await fetch(
        `${apiOrigin}/api.teritorio/geodata/v1/site`
      )
      const config = await configPromise.json()

      store.commit(Mutation.SET, config)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        'Vido error: Unable to fetch the site config from the API',
        error
      )
    }
  },
}

export const getters = {
  all: (state: State) => state,
  infos: (state: State) => (lang: string) => state.infos[lang],
  isLoaded: (state: State) => state.isLoaded,
}
