import { MapStyleEnum } from '@/utils/types'

export const MAP_STYLE_NAMES = {
  [MapStyleEnum.vector]: 'Teritorio',
  [MapStyleEnum.raster]: 'OpenStreetMap',
  [MapStyleEnum.aerial]: 'Imagerie aérienne IGN',
  [MapStyleEnum.bicycle]: 'Teritorio - Vélo',
}

export const DEFAULT_MAP_STYLE: keyof typeof MapStyleEnum = MapStyleEnum.vector
export const EXPLORER_MAP_STYLE: keyof typeof MapStyleEnum = MapStyleEnum.vector

export const LOCAL_STORAGE = { favorites: 'vido:favorites' }

export const MAP_ZOOM = {
  zoom: {
    default: 8,
    max: 20,
    min: 1,
  },
  selectionZoom: {
    poi: 17,
    streetNumber: 15,
    municipality: 12,
  },
}
