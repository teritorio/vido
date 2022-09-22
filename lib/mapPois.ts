export interface ApiPoiId extends Number {}

export interface MapPoiProperties {
  name?: string
  description?: string

  // eslint-disable-next-line camelcase
  'image:thumbnail'?: string

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
