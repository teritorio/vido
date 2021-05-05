import { Store } from 'vuex'

import { LatLng, Pitch, ZoomLevel } from '@/utils/types'

enum Mutation {
  SET_CONFIG = 'SET_CONFIG',
}

interface State {
  // attribution: { [lang: string]: string }
  center: LatLng
  isLoaded: boolean
  pitch: Pitch
  zoom: {
    default: ZoomLevel
    max: ZoomLevel
    min: ZoomLevel
  }
}

export const state = (): State | null => ({
  // attribution: {},
  center: {
    lat: 43.482489,
    lng: -1.559646,
  },
  isLoaded: false,
  pitch: 0,
  zoom: {
    default: 16,
    max: 20,
    min: 1,
  },
})

export const mutations = {
  [Mutation.SET_CONFIG](state: State, payload: State) {
    // state.attribution = payload.attribution
    state.center = payload.center
    state.pitch = payload.pitch || 0
    state.zoom = payload.zoom

    state.isLoaded = true
  },
}

export const actions = {
  async fetchConfig(store: Store<State>, apiOrigin: string) {
    try {
      const configPromise = await fetch(`${apiOrigin}/geodata/v1/map`)
      const config = await configPromise.json()

      store.commit(Mutation.SET_CONFIG, config)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        'Vido error: Unable to fetch the map config from the API',
        error
      )
    }
  },
}

export const getters = {
  all: (state: State) => state,
  // attribution: (state: State) => state.attribution,
  center: (state: State) => state.center,
  isLoaded: (state: State) => state.isLoaded,
  pitch: (state: State) => state.pitch,
  zoom: (state: State) => state.zoom,
}
