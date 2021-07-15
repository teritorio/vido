import { Store } from 'vuex'

enum Mutation {
  TOGGLE_FAVORITES = 'TOGGLE_FAVORITES',
  TOGGLE_FAVORITE_LAYER = 'TOGGLE_FAVORITE_LAYER',
}

export interface State {
  favoritesIds: [string?]
  isFavorite: boolean
}

export const state = (): State => ({
  favoritesIds: [],
  isFavorite: false,
})

export const getters = {
  favoritesIds: (state: State) => state.favoritesIds,
  isFavorite: (state: State) => state.isFavorite,
}

export const mutations = {
  [Mutation.TOGGLE_FAVORITES](state: State, payload: [string]) {
    state.favoritesIds = payload
  },
  [Mutation.TOGGLE_FAVORITE_LAYER](state: State, payload: boolean) {
    state.isFavorite = payload
  },
}

export const actions = {
  toggleFavorites(store: Store<State>, data: [string?]) {
    store.commit(Mutation.TOGGLE_FAVORITES, data)
  },
  handleFavoriteLayer(store: Store<State>, data: boolean) {
    store.commit(Mutation.TOGGLE_FAVORITE_LAYER, data)
  },
}
