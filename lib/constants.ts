import { MapStyleEnum } from '@/utils/types'

export const MAP_STYLE_NAMES = {
  [MapStyleEnum.vector]: 'Teritorio',
  [MapStyleEnum.raster]: 'OpenStreetMap',
  [MapStyleEnum.aerial]: 'Imagerie aérienne IGN',
}

export const DEFAULT_MAP_STYLE: keyof typeof MapStyleEnum = MapStyleEnum.vector
export const EXPLORER_MAP_STYLE: keyof typeof MapStyleEnum = MapStyleEnum.vector

export const LOCAL_STORAGE = { favorites: 'vido:favorites' }
