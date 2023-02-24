import { defineStore } from 'pinia'

import { ApiPoi, ApiPoiId } from '~/lib/apiPois'

const LOCAL_STORAGE = { favorites: 'vido:favorites' }

interface State {
  favoritesIds: ApiPoiId[]
}

function setFavorites(state: State, payload: ApiPoiId[]) {
  state.favoritesIds = payload

  if (!payload) {
    localStorage.removeItem(LOCAL_STORAGE.favorites)
  } else {
    localStorage.setItem(
      LOCAL_STORAGE.favorites,
      JSON.stringify({ favorites: payload, version: 1 })
    )
  }
}

export const favoritesStore = defineStore('favorites', {
  state: (): State => ({
    favoritesIds: [],
  }),

  actions: {
    initFavoritesFromLocalStorage() {
      const local = localStorage.getItem(LOCAL_STORAGE.favorites)
      if (local) {
        this.setFavorites(JSON.parse(local).favorites)
      }
    },

    setFavorites(favorites: ApiPoiId[]) {
      setFavorites(this, favorites)
    },

    toggleFavorite(poi: ApiPoi) {
      const props = poi?.properties
      const id = props?.metadata?.id || (poi?.id as number)
      let newFavorite

      if (id) {
        if (!this.favoritesIds.includes(id)) {
          newFavorite = [...this.favoritesIds, id]
        } else {
          newFavorite = this.favoritesIds.filter(
            (f: ApiPoiId) => `${f}` !== `${id}`
          )
        }

        setFavorites(this, newFavorite)
      }
    },
  },
})
