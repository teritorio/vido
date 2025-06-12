import { encodeBase32 } from 'geohashing'
import { defineStore } from 'pinia'

import type { ApiPoi, ApiPoiId } from '~/lib/apiPois'

const LOCAL_STORAGE = { favorites: 'vido:favorites', favoritesAddr: 'vido:favorites-addr' }

interface State {
  favoritesIds: ApiPoiId[]
  favoriteAddressesObj: Record<string, string> // Replaces Map
  favoriteFeatures: ApiPoi[]
}

export const favoriteStore = defineStore('favorite', {
  state: (): State => ({
    favoritesIds: [],
    favoriteAddressesObj: {},
    favoriteFeatures: [],
  }),

  getters: {
    favoriteAddresses(state: State): Map<string, string> {
      return new Map(Object.entries(state.favoriteAddressesObj))
    },
    favoriteCount(state: State): number {
      return state.favoritesIds.length + Object.keys(state.favoriteAddressesObj).length
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
        const entries: [string, string][] = JSON.parse(addressFavorites).favorites
        this.favoriteAddressesObj = Object.fromEntries(entries)
        this.saveToLocalStorage(LOCAL_STORAGE.favoritesAddr, entries)
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

      if (!this.favoriteAddressesObj[id])
        this.favoriteAddressesObj[id] = hash
      else
        delete this.favoriteAddressesObj[id]

      const entries = Object.entries(this.favoriteAddressesObj)
      this.saveToLocalStorage(LOCAL_STORAGE.favoritesAddr, entries)
    },

    toggleFavorite(poi: ApiPoi | number) {
      const id = typeof poi === 'number' ? poi : poi.properties.metadata.id || (poi.id as number)
      const favIndex = id ? this.favoritesIds.findIndex(favId => favId === id) : false

      if (favIndex === false)
        throw createError({ statusCode: 404, statusMessage: 'Favorite has no ID.' })

      if (favIndex === -1)
        this.favoritesIds.push(id)
      else
        this.favoritesIds.splice(favIndex, 1)

      this.saveToLocalStorage(LOCAL_STORAGE.favorites, this.favoritesIds)
    },

    reset() {
      this.favoritesIds = []
      this.favoriteAddressesObj = {}
      this.saveToLocalStorage(LOCAL_STORAGE.favorites)
      this.saveToLocalStorage(LOCAL_STORAGE.favoritesAddr)
    },
  },

  share: {
    enable: true,
  },
})
