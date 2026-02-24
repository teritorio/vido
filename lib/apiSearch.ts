import type GeoJSON from 'geojson'

export type ApiSearchResult<T> = GeoJSON.FeatureCollection<GeoJSON.Point, T>

export interface ApiPoisSearchResult {
  id: number
  label: string
  icon?: string
  city?: string
}

export interface ApiMenuItemSearchResult {
  id: number
  label: string
  icon?: string

  filter_property?: string

  filter_value?: string | boolean
}

export interface ApiAddrSearchResult {
  id: string
  label: string
  type: 'street' | 'municipality' | 'locality' | 'housenumber'
}

export interface SearchResult {
  id: number | string
  label: string
  icon?: string
  small?: string

  filter_property?: string

  filter_value?: string | boolean
}
