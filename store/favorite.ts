import { Store } from 'vuex'

import { ApiPoi, ApiPoiId } from '~/lib/apiPois'

const LOCAL_STORAGE = { favorites: 'vido:favorites' }

export enum Mutation {
  SET_FAVORITES = 'SET_FAVORITES',
}

export interface State {
  favoritesIds: ApiPoiId[]
}

export const state = (): State => ({
  favoritesIds: [],
})

export const getters = {
  favoritesIds: (state: State) => state.favoritesIds,
}

export const mutations = {
  [Mutation.SET_FAVORITES](state: State, payload: ApiPoiId[]) {
    state.favoritesIds = payload

    if (!payload) {
      localStorage.removeItem(LOCAL_STORAGE.favorites)
    } else {
      localStorage.setItem(
        LOCAL_STORAGE.favorites,
        JSON.stringify({ favorites: payload, version: 1 })
      )
    }
  },
}

export const actions = {
  initFavoritesFromLocalStorage(store: Store<State>) {
    const local = localStorage.getItem(LOCAL_STORAGE.favorites)
    console.error(local)
    if (local) {
      actions.setFavorites(store, JSON.parse(local).favorites)
    }
  },

  setFavorites(store: Store<State>, favorites: ApiPoiId[]) {
    store.commit(Mutation.SET_FAVORITES, favorites)
  },

  toggleFavorite(store: Store<State>, poi: ApiPoi) {
    const props = poi?.properties
    const id = props?.metadata?.id || (poi?.id as number)
    let newFavorite

    if (id) {
      if (!store.state.favoritesIds.includes(id)) {
        newFavorite = [...store.state.favoritesIds, id]
      } else {
        newFavorite = store.state.favoritesIds.filter(
          (f: ApiPoiId) => `${f}` !== `${id}`
        )
      }

      store.commit(Mutation.SET_FAVORITES, newFavorite)
    }
  },
}
