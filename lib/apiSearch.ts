import GeoJSON from 'geojson'

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
  filter_value?: string | boolean
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
  filter_value?: string | boolean
}