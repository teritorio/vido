import type { MapboxGeoJSONFeature, Style } from 'maplibre-gl'

/// <reference types="geojson" />

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
  id: number
  parent: ApiCategoryBase['id']
  level: 1 | 2 | 3
  datasources: DataSource[]
  metadata: {
    color: string
    description: { [lang: string]: string }
    hide: boolean
    label: { [lang: string]: string }
    picto: string
    // eslint-disable-next-line camelcase
    tourism_style_merge: boolean
    // eslint-disable-next-line camelcase
    tourism_style_class: string[]
    // eslint-disable-next-line camelcase
    selection_zoom: number
    // eslint-disable-next-line camelcase
    enabled_by_default: boolean
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

export type OsmPoiType = 'node' | 'way' | 'relation'

export interface VidoFeature extends MapboxGeoJSONFeature {
  // eslint-disable-next-line camelcase
  geometry: GeoJSON.Geometry
  properties: {
    [key: string]: any

    'addr:city'?: string
    'addr:housenumber'?: string
    'addr:postcode'?: string
    'addr:street'?: string
    metadata?: {
      source?: string
      HasPopup?: string
      PID?: string
      PopupAdress?: string
      PopupListField?: string
      color?: string
      hasfiche?: string
      icon?: string
      // eslint-disable-next-line camelcase
      label_infobulle?: string
      // eslint-disable-next-line camelcase
      tourism_style_class?: string | string[]
      'image:thumbnail'?: string
    }
    name?: string
  }
  type: 'Feature'
}

export interface ApiPois {
  type: 'FeaturesCollection'
  features: VidoFeature[]
}

export type ApiSearchResult = {
  postid: number
  label: string
  commune: string | null
  menuId: number
}

export type ApiAddrSearchResult = {
  ID: number
  label: string
  geojson: MapboxGeoJSONFeature
}

export type ApiCartocodeSearchResult = {
  postid: number
  label: string
}

export type ApiFilterSearchResult = {
  filter: string
  filterid: number
  label: string
  menuId: number
  tag: string
}

export type ApiSearchResults = {
  classe: ApiFilterSearchResult[]
  osm: string | ApiSearchResult[]
  tis: string | ApiSearchResult[]
  wp: string | ApiSearchResult[]
  adress: string | ApiAddrSearchResult[]
  municipality: string | ApiAddrSearchResult[]
  cartocode: ApiCartocodeSearchResult | ApiCartocodeSearchResult[]
}

export type SearchResult = {
  id: number
  label: string
  icon?: string
  small?: string
}

export type VidoMglStyle = Style & {
  sources: {}
  // eslint-disable-next-line camelcase
  vido_israster: boolean
}

export enum Mode {
  BROWSER = 'BROWSER', // User browses by category
  EXPLORER = 'EXPLORER', // User explores around
}

export enum MapStyle {
  teritorio = 'teritorio',
  mapnik = 'mapnik',
  aerial = 'aerial',
}

export type NavMenuEntry = {
  // eslint-disable-next-line camelcase
  post_id: number
  title: string
  url: string
}
