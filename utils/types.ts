import GeoJSON from 'geojson'

export interface MultilingualString {
  [lang: string]: string
}

export interface LatLng {
  lat: number
  lng: number
}

/** [lat, lng] */
export type TupleLatLng = [number, number]

export type ZoomLevel = number
export type Pitch = number

export type FilterValues = {
  values: {
    [key: string]: string[]
  }
  dateRange?: {
    propertyStart?: string
    propertyEnd?: string
    value: [Date, Date]
  }
}

export interface ApiSearchResult<T>
  extends GeoJSON.FeatureCollection<GeoJSON.Point, T> {}

export type ApiPoisSearchResult = {
  id: number
  label: string
  icon?: string
  city?: string
}

export type ApiMenuItemSearchResult = {
  id: number
  label: string
  icon?: string
  // eslint-disable-next-line camelcase
  filter_property?: string
  // eslint-disable-next-line camelcase
  filter_value?: string
}

export type ApiAddrSearchResult = {
  id: number
  label: string
  type: 'street' | 'municipality'
}

export type SearchResult = {
  id: number
  label: string
  icon?: string
  small?: string
  // eslint-disable-next-line camelcase
  filter_property?: string
  // eslint-disable-next-line camelcase
  filter_value?: string
}

export enum Mode {
  BROWSER = 'browser', // User browses by category
  EXPLORER = 'explorer', // User explores around
  FAVORITES = 'favorites', // User favorites
}

export enum MapStyleEnum {
  vector = 'vector',
  raster = 'raster',
  aerial = 'aerial',
}

export type NavMenuEntry = {
  // eslint-disable-next-line camelcase
  post_id: number
  title: string
  url: string
}
