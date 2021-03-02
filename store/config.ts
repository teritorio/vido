import { Store } from 'vuex'

enum Mutation {
  SET = 'SET',
}

interface LatLng {
  lat: number
  lng: number
}

type ZoomLevel = number
type Pitch = number

interface ClassMetadata {
  label: { [lang: string]: string }
  color?: string // Inherited from its parent by default
  picto?: string // Inherited from its parent by default
}

interface Class {
  id: string
  metadata: ClassMetadata
  order?: number
  parents?: {
    [className: string]: {
      id: string
      order: number
      metadata?: ClassMetadata // Inherited from its parent by default
    }
  }
}

interface State {
  site: {
    [lang: string]: {
      name: string
      description: string
      logo: string
    }
  } | null
  map: {
    attribution: { [lang: string]: string }
    center: LatLng
    zoom: {
      default: ZoomLevel
      max: ZoomLevel
      min: ZoomLevel
    }
    pitch: Pitch
  } | null
  classes: {
    [lang: string]: Class
  } | null
}

export const state = (): State => ({
  site: null,
  map: null,
  classes: null,
})

export const mutations = {
  [Mutation.SET](state: State, config: State) {
    state.site = config.site
    state.map = config.map
    state.classes = config.classes
  },
}

export const actions = {
  async fetch(store: Store<State>) {
    try {
      const configPromise = await fetch('/api/config')
      const config = await configPromise.json()

      store.commit(Mutation.SET, config)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Vido error: Unable to fetch the config from the API')
    }
  },
}

export const getters = {
  site: (state: State) => state.site,
  map: (state: State) => state.map,
  classes: (state: State) => state.classes,
}
