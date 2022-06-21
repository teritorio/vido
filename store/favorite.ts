import { Store } from 'vuex'

enum Mutation {
  SET_FAVORITES = 'SET_FAVORITES',
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
  [Mutation.SET_FAVORITES](state: State, payload: [number]) {
    state.favoritesIds = payload
  },
}

export const actions = {
  setFavorites(store: Store<State>, data: [number?]) {
    store.commit(Mutation.SET_FAVORITES, data)
  },
}
