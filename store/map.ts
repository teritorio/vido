import { Store } from 'vuex'

import { LatLng, Pitch, ZoomLevel, VidoFeature, SiteInfos } from '@/utils/types'

enum Mutation {
  SET_CONFIG = 'SET_CONFIG',
  RESET_MAPVIEW = 'RESET_MAPVIEW',
  SELECT_FEATURE = 'SELECT_FEATURE',
}

interface FetchConfigPayload {
  config: SiteInfos
}

interface State {
  // attribution: { [lang: string]: string }
  attribution: string[]
  center: LatLng
  isLoaded: boolean
  pitch: Pitch
  zoom: {
    default: ZoomLevel
    max: ZoomLevel
    min: ZoomLevel
  }
  selectedFeature: string | null
  // eslint-disable-next-line camelcase
  selection_zoom: {
    // eslint-disable-next-line camelcase
    zoom_tis: number
    // eslint-disable-next-line camelcase
    zoom_osm: number
    // eslint-disable-next-line camelcase
    zoom_wp: number
    // eslint-disable-next-line camelcase
    zoom_ban: number
    // eslint-disable-next-line camelcase
    zoom_commune: number
  }
}

const getInitialMapview: Function = () => ({
  attribution: [],
  center: {
    lat: 44.0122,
    lng: -0.6984,
  },
  zoom: {
    default: 8,
    max: 20,
    min: 1,
  },
  selection_zoom: {
    zoom_tis: 10,
    zoom_osm: 10,
    zoom_wp: 10,
    zoom_ban: 10,
    zoom_commune: 10,
  },
})

export const state = (): State | null =>
  Object.assign(
    {
      // attribution: {},
      isLoaded: false,
      pitch: 0,
      selectedFeature: null,
    },
    getInitialMapview()
  )

export const mutations = {
  [Mutation.SET_CONFIG](state: State, payload: State) {
    // state.attribution = payload.attribution
    state.center = payload.center
    state.pitch = payload.pitch || 0
    state.zoom = payload.zoom
    state.selection_zoom = payload.selection_zoom
    state.attribution = payload.attribution

    state.isLoaded = true
  },
  [Mutation.RESET_MAPVIEW](state: State) {
    state.center = getInitialMapview().center
    state.zoom = getInitialMapview().zoom
  },
  [Mutation.SELECT_FEATURE](state: State, payload: State) {
    // JSON conversion necessary to have map watcher working
    state.selectedFeature =
      payload.selectedFeature && JSON.stringify(payload.selectedFeature)
  },
}

export const actions = {
  fetchConfig(store: Store<State>, { config }: FetchConfigPayload) {
    try {
      store.commit(
        Mutation.SET_CONFIG,
        Object.assign(store.state, {
          center: config.bbox_line && {
            lng:
              (config.bbox_line.coordinates[0][0] +
                config.bbox_line.coordinates[1][0]) /
              2,
            lat:
              (config.bbox_line.coordinates[0][1] +
                config.bbox_line.coordinates[1][1]) /
              2,
          },
          attribution: config.attributions || [],
        })
      )
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Vido error: Unable to fetch the map config', error)
    }
  },
  resetMapview(store: Store<State>) {
    store.commit(Mutation.RESET_MAPVIEW)
  },
  selectFeature(store: Store<State>, feature: VidoFeature) {
    store.commit(Mutation.SELECT_FEATURE, { selectedFeature: feature })
  },
}

export const getters = {
  all: (state: State) => state,
  attribution: (state: State) => state.attribution,
  center: (state: State) => state.center,
  isLoaded: (state: State) => state.isLoaded,
  pitch: (state: State) => state.pitch,
  zoom: (state: State) => state.zoom,
  selectionZoom: (state: State) => state.selection_zoom,
  selectedFeature: (state: State) =>
    state.selectedFeature && JSON.parse(state.selectedFeature),
}
