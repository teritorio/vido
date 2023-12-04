export type MapPoiId = number

export interface MapPoiProperties {
  [key: string]: any

  name?: string
  description?: string

  // eslint-disable-next-line camelcase
  'image:thumbnail'?: string

  metadata: {
    id: MapPoiId
  }

  display?: {
    icon: string
    // eslint-disable-next-line camelcase
    color_fill?: string
    // eslint-disable-next-line camelcase
    color_line?: string
    text?: string
  }
}
export type MapPoi = GeoJSON.Feature<GeoJSON.Geometry, MapPoiProperties>

export type MapPoiCollection = GeoJSON.FeatureCollection<
  GeoJSON.Geometry,
  MapPoiProperties
>
