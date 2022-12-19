export interface MapPoiId extends Number {}

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
  }
}
export interface MapPoi
  extends GeoJSON.Feature<GeoJSON.Geometry, MapPoiProperties> {}

export interface MapPoiCollection
  extends GeoJSON.FeatureCollection<GeoJSON.Geometry, MapPoiProperties> {}
