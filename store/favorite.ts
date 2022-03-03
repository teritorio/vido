import { Store } from 'vuex'

enum Mutation {
  TOGGLE_FAVORITES = 'TOGGLE_FAVORITES',
  TOGGLE_FAVORITE_LAYER = 'TOGGLE_FAVORITE_LAYER',
  SET_FAVORITES_ACTION = 'SET_FAVORITES_ACTION',
}

export interface State {
  favoritesIds: [string?]
  isModeFavorites: boolean
  favoritesAction: 'add' | 'close' | 'delete' | 'open' | null
}

export const state = (): State => ({
  favoritesIds: [],
  isModeFavorites: false,
  favoritesAction: null,
})

export const getters = {
  favoritesIds: (state: State) => state.favoritesIds,
  isModeFavorites: (state: State) => state.isModeFavorites,
  favoritesAction: (state: State) => state.favoritesAction,
}

export const mutations = {
  [Mutation.TOGGLE_FAVORITES](state: State, payload: [string]) {
    state.favoritesIds = payload
  },
  [Mutation.SET_FAVORITES_ACTION](
    state: State,
    payload: State['favoritesAction']
  ) {
    state.favoritesAction = payload
  },
  [Mutation.TOGGLE_FAVORITE_LAYER](state: State, payload: boolean) {
    state.isModeFavorites = payload
  },
}

export const actions = {
  toggleFavoriteModes(store: Store<State>, data: [string?]) {
    store.commit(Mutation.TOGGLE_FAVORITES, data)
  },
  handleFavoriteLayer(store: Store<State>, data: boolean) {
    store.commit(Mutation.TOGGLE_FAVORITE_LAYER, data)
  },
  setFavoritesAction(store: Store<State>, action: string) {
    store.commit(Mutation.SET_FAVORITES_ACTION, action)
  },
}
