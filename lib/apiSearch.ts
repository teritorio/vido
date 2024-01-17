import type GeoJSON from 'geojson'

import type { ApiPoiId } from './apiPois'

export type ApiSearchResult<T> = GeoJSON.FeatureCollection<GeoJSON.Point, T>

export interface ApiPoisSearchResult {
  id: ApiPoiId
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
  id: number
  label: string
  type: 'street' | 'municipality'
}

export interface SearchResult {
  id: ApiPoiId | number
  label: string
  icon?: string
  small?: string

  filter_property?: string

  filter_value?: string | boolean
}
