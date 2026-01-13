import type { LanguageCode, MultilingualString } from '~/utils/types'

export interface ApiPoiProperties {
  [key: string]: any
  'name'?: MultilingualString
  'image'?: string[]
  'image:thumbnail'?: string
  'metadata': ApiPoiPropertiesMetadata
  'display'?: ApiPoiPropertiesDisplay
  'editorial'?: ApiPoiPropertiesEditorial
  'ref'?: string
  'text'?: ApiPoiPropertiesText
  'start_end_date'?: ApiPoiPropertiesStartEndDate
  'addr'?: ApiPoiPropertiesAddress
  'route'?: ApiPoiPropertiesRoute
}

export interface ApiPoiPropertiesText {
  html: boolean
  value: string
  is_shortened: boolean
}

export interface ApiPoiPropertiesStartEndDate {
  start_date: string
  end_date: string
}

export type ApiPoiPropertiesAddress = {
  street?: string
  hamlet?: string
  postcode?: string
  city?: string
  country?: string
} & {
  [key: string]: string
}

export type ApiPoiPropertiesRoute = {
  [lang in LanguageCode]?: {
    gpx_trace?: string
    pdf?: string
    hiking?: {
      difficulty: 'easy' | 'normal' | 'hard'
      duration: number
      length: number
    }
  }
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
  color_text?: TextColors
}

export interface ApiPoiPropertiesEditorial {
  'website:details'?: MultilingualString
  'unavoidable'?: boolean
}

export type TextColors = '#000000' | '#FFFFFF'

export type ApiPoi = GeoJSON.Feature<GeoJSON.Geometry, ApiPoiProperties>

export type ApiPoiCollection = GeoJSON.FeatureCollection<GeoJSON.Geometry, ApiPoiProperties>
