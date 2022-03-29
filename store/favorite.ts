import { Store } from 'vuex'

enum Mutation {
  TOGGLE_FAVORITES = 'TOGGLE_FAVORITES',
  SET_FAVORITES_ACTION = 'SET_FAVORITES_ACTION',
}

export interface State {
  favoritesIds: [number?]
  favoritesAction: 'add' | 'close' | 'delete' | 'open' | null
}

export const state = (): State => ({
  favoritesIds: [],
  favoritesAction: null,
})

export const getters = {
  favoritesIds: (state: State) => state.favoritesIds,
  favoritesAction: (state: State) => state.favoritesAction,
}

export const mutations = {
  [Mutation.TOGGLE_FAVORITES](state: State, payload: [number]) {
    state.favoritesIds = payload
  },
  [Mutation.SET_FAVORITES_ACTION](
    state: State,
    payload: State['favoritesAction']
  ) {
    state.favoritesAction = payload
  },
}

export const actions = {
  toggleFavoritesMode(store: Store<State>, data: [number?]) {
    store.commit(Mutation.TOGGLE_FAVORITES, data)
  },
  setFavoritesAction(store: Store<State>, action: string) {
    store.commit(Mutation.SET_FAVORITES_ACTION, action)
  },
}
