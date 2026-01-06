import type { MultilingualString } from '~/utils/types'

export interface ApiPoiProperties {
  [key: string]: any
  'name'?: MultilingualString
  'image'?: string[]
  'image:thumbnail'?: string
  'metadata': ApiPoiPropertiesMetadata
  'display'?: ApiPoiPropertiesDisplay
  'editorial'?: ApiPoiPropertiesEditorial
  'ref'?: string
}

export interface ApiPoiPropertiesMetadata {
  id: number
  cartocode?: string
  category_ids?: number[]
  updated_at?: string
  source?: string
  osm_id?: number
  osm_type?: 'node' | 'way' | 'relation'
  dep_ids?: number[]
  report_issue_url?: string
}

export interface ApiPoiPropertiesDisplay {
  color_fill?: string
  color_line?: string
  color_text?: string
}

export interface ApiPoiPropertiesEditorial {
  'website:details'?: MultilingualString
  'unavoidable': boolean
}

export type ApiPoi = GeoJSON.Feature<GeoJSON.Geometry, ApiPoiProperties>
