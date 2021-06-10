import { Style, MapboxGeoJSONFeature } from 'maplibre-gl'

export interface LatLng {
  lat: number
  lng: number
}

/** [lat, lng] */
export type TupleLatLng = [number, number]

export type ZoomLevel = number
export type Pitch = number

export type PoiType = 'tis' | 'osm' | 'zone'

export type SelectionFiltre = {
  tag: string
  label: string
  values: { [val: string]: string }
}

export type SelectionFiltreDS = SelectionFiltre & {
  datasourceId: string
}

export type BooleanFiltre = { [val: string]: string }

export type BooleanFiltreDS = BooleanFiltre & {
  datasourceId: string
}

export type CheckboxFiltre = {
  tag: string
  label: string
  values: string
}

export type CheckboxFiltreDS = CheckboxFiltre & {
  datasourceId: string
}

export type DataSource = {
  idsrc: string
  // eslint-disable-next-line camelcase
  poi_type: PoiType
  slug: string
  HasFiltre: boolean
  filtre: null | {
    selectionFiltre: null | SelectionFiltre[]
    booleanFiltre: null | BooleanFiltre
    checkboxFiltre: null | CheckboxFiltre[]
  }
}

export type FiltreValues = {
  booleanFiltre?: { [key: string]: string[] }
  checkboxFiltre?: { [key: string]: string[] }
  selectionFiltre?: { [key: string]: string[] }
}

export interface ApiCategoryBase {
  id: string
  parent: string
  level: 1 | 2 | 3
  datasources: DataSource[]
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

export type CategoryBase = ApiCategoryBase & {
  // eslint-disable-next-line camelcase
  vido_children: null | ApiCategoryBase['id'][]
}

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
    [key: string]: any

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

export type ApiSearchResult = {
  postid: number
  label: string
}

export type ApiAddrSearchResult = {
  ID: string
  label: string
  geojson: MapboxGeoJSONFeature
}

export type ApiSearchResults = {
  classe: {
    idmenu: string
    label: string
    // eslint-disable-next-line camelcase
    poi_type: string
  }[]
  osm: string | ApiSearchResult[]
  tis: string | ApiSearchResult[]
  wp: string | ApiSearchResult[]
  adress: string | ApiAddrSearchResult[]
  municipality: string | ApiAddrSearchResult[]
}

export type SearchResult = {
  id: string
  label: string
}

export type VidoMglStyle = Style & {
  // eslint-disable-next-line camelcase
  vido_israster: boolean
}

export enum Mode {
  BROWSER = 'BROWSER', // User browses by category
  EXPLORER = 'EXPLORER', // User explores around
}
