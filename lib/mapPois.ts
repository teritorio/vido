export type MapPoiId = number

export interface MapPoiDescription {
  'fr-FR': {
    value: string
    html: boolean
    is_shortened: boolean
  }
}

export interface MapPoiProperties {
  [key: string]: any
  'name'?: MultilingualString
  'description'?: MapPoiDescription
  'image:thumbnail'?: string
  'metadata': {
    id: MapPoiId
  }
  'display'?: {
    icon: string
    color_fill?: string
    color_line?: string
    color_text?: '#000000' | '#FFFFFF'
    text?: string
  }
}
export type MapPoi = GeoJSON.Feature<GeoJSON.Geometry, MapPoiProperties>

export type MapPoiCollection = GeoJSON.FeatureCollection<
  GeoJSON.Geometry,
  MapPoiProperties
>
