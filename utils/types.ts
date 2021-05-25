import { Style, MapboxGeoJSONFeature } from 'mapbox-gl'

export interface LatLng {
  lat: number
  lng: number
}

/** [lat, lng] */
export type TupleLatLng = [number, number]

export type ZoomLevel = number
export type Pitch = number

export type PoiType = 'tis' | 'osm' | 'zone'

export interface ApiCategoryBase {
  id: string
  parent: string
  level: 1 | 2 | 3
  datasources: {
    idsrc: string
    // eslint-disable-next-line camelcase
    poi_type: PoiType
    slug: string
  }
  isDataItem: string | boolean
  metadata: {
    color: string
    count: number
    description: { [lang: string]: string }
    hide: boolean
    label: { [lang: string]: string }
    picto: string
  }
  order: number
}

export type CategoryBase = ApiCategoryBase

// Only first level classes can be highlighted
export interface RootCategory extends CategoryBase {
  highlighted: boolean
  level: 1
}

export interface SubCategory extends CategoryBase {
  level: 2 | 3
}

export type Category = CategoryBase & (RootCategory | SubCategory)

export interface SiteInfos {
  [lang: string]: {
    name: string
    description: string
    logo: string
  }
}

export type GeometryType = 'Point'

export type OsmPoiType = 'node' | 'way' | 'relation'

export interface FeatureBase extends MapboxGeoJSONFeature {
  // eslint-disable-next-line camelcase
  geometry: {
    coordinates: TupleLatLng
    type: GeometryType
  }
  properties: {
    'addr:city': string
    'addr:housenumber': string
    'addr:postcode': string
    'addr:street': string
    metadata: {
      HasPopup: string
      PID: string
      PopupAdress: string
      PopupListField: string
      // eslint-disable-next-line camelcase
      acf_groups: string
      classe: string
      color: string
      hasfiche: string
      icon: string
      idmn1: string | null
      idmn3: string | null
      // eslint-disable-next-line camelcase
      label_infobulle: string
      // eslint-disable-next-line camelcase
      mn3_slug: string
      // eslint-disable-next-line camelcase
      post_name: string
      // eslint-disable-next-line camelcase
      tourism_style_class: string | string[]
      wkt: string
    }
    name: string
    // eslint-disable-next-line camelcase
    post_title: string
    // eslint-disable-next-line camelcase
    url_fiche: string
  }
  type: 'Feature'
}

export type OsmFeature = FeatureBase & {
  // eslint-disable-next-line camelcase
  covid19_fields: unknown[]
  properties: {
    'addr:city': string
    'addr:housenumber': string
    'addr:postcode': string
    'addr:street': string
    metadata: {
      idosm: string
      // eslint-disable-next-line camelcase
      osm_poi_type: OsmPoiType
      timestamp: string
      user: string
    }
    name: string
    // eslint-disable-next-line camelcase
    post_title: string
    // eslint-disable-next-line camelcase
    url_fiche: string
  }
  // eslint-disable-next-line camelcase
  wp_tags: {
    [key: string]: unknown[]
  }
}

export type TisFeature = FeatureBase & {
  properties: {
    // eslint-disable-next-line camelcase
    tis_COMMUNE: string
    // eslint-disable-next-line camelcase
    tis_COMMUNEINSEE: string
    // eslint-disable-next-line camelcase
    tis_CP: string
    // eslint-disable-next-line camelcase
    tis_id: string
    // eslint-disable-next-line camelcase
    tis_LOCALISATION: string
    // eslint-disable-next-line camelcase
    tis_ObjectTypeName: string
    // eslint-disable-next-line camelcase
    tis_PHOTO: string[]
    // eslint-disable-next-line camelcase
    tis_SyndicObjectID: string
    // eslint-disable-next-line camelcase
    tis_SyndicObjectName: string
    // eslint-disable-next-line camelcase
    tis_TEL: string
    // eslint-disable-next-line camelcase
    tis_URL: string
  }
}

export type VidoFeature = (TisFeature | OsmFeature) & {
  properties: {
    // eslint-disable-next-line camelcase
    vido_cat: number | null
  }
}

export interface ApiPosts {
  osm?: Array<{
    FeaturesCollection: {
      features: OsmFeature[]
      type: 'FeatureCollection'
    }
  }>
  tis?: Array<{
    FeaturesCollection: {
      features: TisFeature[]
      type: 'FeatureCollection'
    }
  }>
}

export type VidoMglStyle = Style & {
  // eslint-disable-next-line camelcase
  vido_israster: boolean
}
