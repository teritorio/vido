import { Store } from 'vuex'

enum Mutation {
  TOGGLE_FAVORITES = 'TOGGLE_FAVORITES',
}

export interface State {
  favoritesIds: [number?]
}

export const state = (): State => ({
  favoritesIds: [],
})

export const getters = {
  favoritesIds: (state: State) => state.favoritesIds,
}

export const mutations = {
  [Mutation.TOGGLE_FAVORITES](state: State, payload: [number]) {
    state.favoritesIds = payload
  },
}

export const actions = {
  toggleFavoritesMode(store: Store<State>, data: [number?]) {
    store.commit(Mutation.TOGGLE_FAVORITES, data)
  },
}
