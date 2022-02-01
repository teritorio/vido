import { MapStyleEnum } from '@/utils/types'

export const MAP_STYLES = {
  [MapStyleEnum.teritorio]: 'Teritorio',
  [MapStyleEnum.mapnik]: 'OpenStreetMap',
  [MapStyleEnum.aerial]: 'Imagerie aérienne IGN',
}

export const DEFAULT_MAP_STYLE: keyof typeof MapStyleEnum = 'teritorio'
export const EXPLORER_MAP_STYLE: keyof typeof MapStyleEnum = 'teritorio'

export const LOCAL_STORAGE = { favorites: 'vido:favorites' }
