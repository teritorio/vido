import { encodeBase32 } from 'geohashing'
import { defineStore } from 'pinia'

import type { ApiPoi, ApiPoiId } from '~/lib/apiPois'

const LOCAL_STORAGE = { favorites: 'vido:favorites', favoritesAddr: 'vido:favorites-addr' }

type FavoriteAddress = Map<string, string>

interface State {
  favoritesIds: ApiPoiId[]
  favoriteAddresses: FavoriteAddress
  favoriteFeatures: ApiPoi[]
}

export const favoriteStore = defineStore('favorite', {
  state: (): State => ({
    favoritesIds: [],
    favoriteAddresses: new Map(),
    favoriteFeatures: [],
  }),

  getters: {
    favoriteCount: (state: State) => {
      return state.favoritesIds.length + state.favoriteAddresses.size
    },
  },

  actions: {
    init() {
      const poiFavorites = localStorage.getItem(LOCAL_STORAGE.favorites)
      const addressFavorites = localStorage.getItem(LOCAL_STORAGE.favoritesAddr)

      if (poiFavorites) {
        const favorites = JSON.parse(poiFavorites).favorites
        this.favoritesIds = favorites
        this.saveToLocalStorage(LOCAL_STORAGE.favorites, favorites)
      }

      if (addressFavorites) {
        const favorites: FavoriteAddress = new Map(JSON.parse(addressFavorites).favorites)
        this.favoriteAddresses = favorites
        this.saveToLocalStorage(LOCAL_STORAGE.favoritesAddr, Array.from(favorites.entries()))
      }
    },

    saveToLocalStorage(key: string, favorites?: ApiPoiId[] | [string, string][]) {
      if (!favorites)
        localStorage.removeItem(key)
      else
        localStorage.setItem(key, JSON.stringify({ favorites, version: 1 }))
    },

    toggleFavoriteAddr(poi: ApiPoi) {
      const id = poi.properties.metadata.id.toString()
      const coords = (poi.geometry as GeoJSON.Point).coordinates
      const hash = encodeBase32(coords[1], coords[0])

      if (!this.favoriteAddresses.has(id))
        this.favoriteAddresses.set(id, hash)
      else
        this.favoriteAddresses.delete(id)

      this.saveToLocalStorage(LOCAL_STORAGE.favoritesAddr, Array.from(this.favoriteAddresses.entries()))
    },

    toggleFavorite(poi: ApiPoi | number) {
      const id = typeof poi === 'number' ? poi : poi.properties.metadata.id || (poi.id as number)
      const favIndex = id ? this.favoritesIds.findIndex(favId => favId === id) : false

      if (favIndex === false)
        throw createError({ statusCode: 404, statusMessage: 'Favorite has not ID.' })

      if (favIndex === -1)
        this.favoritesIds.push(id)
      else
        this.favoritesIds.splice(favIndex, 1)

      this.saveToLocalStorage(LOCAL_STORAGE.favorites, this.favoritesIds)
    },

    reset() {
      this.favoritesIds = []
      this.favoriteAddresses = new Map()
      this.saveToLocalStorage(LOCAL_STORAGE.favorites)
      this.saveToLocalStorage(LOCAL_STORAGE.favoritesAddr)
    },
  },

  share: {
    enable: true,
  },
})
