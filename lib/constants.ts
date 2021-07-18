import { MapStyle } from '@/utils/types'

export const MAP_STYLES = {
  [MapStyle.teritorio]: 'Teritorio',
  [MapStyle.mapnik]: 'OpenStreetMap',
  [MapStyle.aerial]: 'Imagerie aérienne IGN',
}

export const DEFAULT_MAP_STYLE: keyof typeof MapStyle = 'teritorio'
export const EXPLORER_MAP_STYLE: keyof typeof MapStyle = 'teritorio'

export const LOCAL_STORAGE = { favorites: 'vido:favorites' }
