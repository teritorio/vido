import { encodeBase32 } from 'geohashing'
import { defineStore } from 'pinia'
import type { Poi } from '~/types/local/poi'

const LOCAL_STORAGE = { favorites: 'vido:favorites', favoritesAddr: 'vido:favorites-addr' }

export const favoriteStore = defineStore('favorite', () => {
  const favoritesIds = ref<number[]>([])
  const favoriteAddressesObj = ref<Record<string, string>>({})
  const favoriteFeatures = ref<Poi[]>([])

  const isFavorite = computed((): (id: number) => boolean => {
    return id => !!favoritesIds.value.find(fav => fav === id)
  })

  const favoriteAddresses = computed((): Map<string, string> => {
    return new Map(Object.entries(favoriteAddressesObj.value))
  })

  const favoriteCount = computed((): number => {
    return favoritesIds.value.length + Object.keys(favoriteAddressesObj.value).length
  })

  function init() {
    const poiFavorites = localStorage.getItem(LOCAL_STORAGE.favorites)
    const addressFavorites = localStorage.getItem(LOCAL_STORAGE.favoritesAddr)

    if (poiFavorites) {
      const favorites = JSON.parse(poiFavorites).favorites
      favoritesIds.value = favorites
      saveToLocalStorage(LOCAL_STORAGE.favorites, favorites)
    }

    if (addressFavorites) {
      const entries: [string, string][] = JSON.parse(addressFavorites).favorites
      favoriteAddressesObj.value = Object.fromEntries(entries)
      saveToLocalStorage(LOCAL_STORAGE.favoritesAddr, entries)
    }
  }

  function saveToLocalStorage(key: string, favorites?: number[] | [string, string][]) {
    if (!favorites)
      localStorage.removeItem(key)
    else
      localStorage.setItem(key, JSON.stringify({ favorites, version: 1 }))
  }

  function toggleFavoriteAddr(poi: Poi) {
    const id = poi.properties.metadata.id.toString()
    const coords = (poi.geometry as GeoJSON.Point).coordinates
    const hash = encodeBase32(coords[1], coords[0])

    if (!favoriteAddressesObj.value[id])
      favoriteAddressesObj.value[id] = hash
    else
      delete favoriteAddressesObj.value[id]

    const entries = Object.entries(favoriteAddressesObj.value)
    saveToLocalStorage(LOCAL_STORAGE.favoritesAddr, entries)
  }

  function toggleFavorite(poi: Poi | number) {
    const id = typeof poi === 'number' ? poi : poi.properties.metadata.id || (poi.id as number)
    const favIndex = id ? favoritesIds.value.findIndex(favId => favId === id) : false

    if (favIndex === false)
      throw createError({ statusCode: 404, statusMessage: 'Favorite has no ID.' })

    if (favIndex === -1)
      favoritesIds.value.push(id)
    else
      favoritesIds.value.splice(favIndex, 1)

    saveToLocalStorage(LOCAL_STORAGE.favorites, favoritesIds.value)
  }

  function reset() {
    favoritesIds.value = []
    favoriteAddressesObj.value = {}
    saveToLocalStorage(LOCAL_STORAGE.favorites)
    saveToLocalStorage(LOCAL_STORAGE.favoritesAddr)
  }

  return {
    favoritesIds,
    favoriteAddressesObj,
    favoriteFeatures,
    isFavorite,
    favoriteAddresses,
    favoriteCount,
    init,
    saveToLocalStorage,
    toggleFavoriteAddr,
    toggleFavorite,
    reset,
  }
}, {
  share: {
    enable: true,
  },
})
