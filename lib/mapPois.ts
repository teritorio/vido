export type MapPoiId = number

export interface MapPoiProperties {
  [key: string]: any
  'name'?: string
  'description'?: string
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
