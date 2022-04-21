import GeoJSON from 'geojson'

export interface VidoConfig {
  API_SEARCH: string
  API_SEARCH_ADDR: string
  API_EXPORT: string
  API_QR_SHORTENER: string
  NOTEBOOK_ENABLED: boolean
  API_ENDPOINT: string
  API_PROJECT: string
  API_THEME: string
  VECTO_STYLE_URL: string
  SATELLITE_STYLE_URL: string
  RASTER_STYLE_URL: string
  MAPILLARY_ACCESS_TOKEN: string | null
  GOOGLE_TAG_MANAGER_ID: string | null
  SENTRY_DSN: string | null
}

export interface VidosConfig {
  [key: string]: VidoConfig
}

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
    value: [string, string]
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
