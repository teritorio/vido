import GeoJSON from 'geojson'

export interface MultilingualString {
  [lang: string]: string
}

export interface LatLng {
  lat: number
  lng: number
}

/** [lat, lng] */
export type TupleLatLng = [number, number]

export type ZoomLevel = number
export type Pitch = number

export type Filter = {
  type: 'multiselection' | 'checkboxes_list' | 'boolean'
  property: MultilingualString
  label: MultilingualString
  values: {
    value: string
    name: MultilingualString[]
  }
}

export type FilterValues = {
  [key: string]: string[]
}

export interface ApiMenuItem {
  id: number
  // eslint-disable-next-line camelcase
  parent_id: ApiMenuItem['id'] | null
  // eslint-disable-next-line camelcase
  index_order: number
  hidden: boolean
  // eslint-disable-next-line camelcase
  selected_by_default: boolean
  // eslint-disable-next-line camelcase
}

export interface ApiMenuGroup extends ApiMenuItem {
  // eslint-disable-next-line camelcase
  menu_group: {
    name: MultilingualString
    icon: string
    color: string
    // eslint-disable-next-line camelcase
    tourism_style_class: string[]
    // eslint-disable-next-line camelcase
    display_mode: 'large' | 'compact'
  }
  category: undefined
}

export interface ApiMenuCategory extends ApiMenuItem {
  // eslint-disable-next-line camelcase
  menu_group: undefined
  category: {
    name: MultilingualString
    icon: string
    color: string
    // eslint-disable-next-line camelcase
    tourism_style_class: string[]
    // eslint-disable-next-line camelcase
    tourism_style_merge: boolean
    // eslint-disable-next-line camelcase
    display_mode: 'large' | 'compact'
    zoom: number

    filters?: Filter[]
  }
}

export interface MenuGroup extends ApiMenuGroup {
  // eslint-disable-next-line camelcase
  vido_children: null | ApiMenuItem['id'][]
  highlighted: boolean
}

export interface MenuCategory extends ApiMenuCategory {
  // eslint-disable-next-line camelcase
  vido_children: null | ApiMenuItem['id'][]
  highlighted: boolean
}

export type Category = MenuGroup | MenuCategory

export interface SiteInfosTheme {
  id: number
  slug: string
  title: MultilingualString
  description: MultilingualString
  // eslint-disable-next-line camelcase
  site_url: MultilingualString
  // eslint-disable-next-line camelcase
  main_url: MultilingualString
  // eslint-disable-next-line camelcase
  logo_url: string
  // eslint-disable-next-line camelcase
  favicon_url: string
}

export interface Settings {
  id: number
  slug: string
  name: MultilingualString
  attributions: string[]
  // eslint-disable-next-line camelcase
  icon_font_css_url: string
  // eslint-disable-next-line camelcase
  bbox_line: GeoJSON.LineString

  themes: SiteInfosTheme[]
}

export interface VidoFeatureProperties {
  [key: string]: any

  name?: string

  image?: string[]
  // eslint-disable-next-line camelcase
  'image:thumbnail'?: string

  'addr:city'?: string
  'addr:housenumber'?: string
  'addr:postcode'?: string
  'addr:street'?: string

  metadata?: {
    id?: number
    source?: string
    // eslint-disable-next-line camelcase
    category_ids?: Array<number>
  }
  display?: {
    icon?: string
    color?: string
    // eslint-disable-next-line camelcase
    tourism_style_class?: string[]
  }
  editorial?: {
    // eslint-disable-next-line camelcase
    popup_properties?: string[]
    // eslint-disable-next-line camelcase
    class_label?: MultilingualString
    // eslint-disable-next-line camelcase
    class_label_popup?: MultilingualString
    // eslint-disable-next-line camelcase
    class_label_details?: MultilingualString
    'website:details'?: string
  }
}
export interface VidoFeature
  extends GeoJSON.Feature<GeoJSON.Geometry, VidoFeatureProperties> {}

export interface ApiPois
  extends GeoJSON.FeatureCollection<GeoJSON.Geometry, VidoFeatureProperties> {}

export interface ApiSearchResult<T>
  extends GeoJSON.FeatureCollection<GeoJSON.Point, T> {}

export type ApiPoisSearchResult = {
  id: number
  label: string
  icon?: string
  city?: string
}

export type ApiMenuItemSearchResult = {
  id: number
  label: string
  icon?: string
  // eslint-disable-next-line camelcase
  filter_property?: string
  // eslint-disable-next-line camelcase
  filter_value?: string
}

export type ApiAddrSearchResult = {
  id: number
  label: string
  type: 'street' | 'municipality'
}

export type SearchResult = {
  id: number
  label: string
  icon?: string
  small?: string
  // eslint-disable-next-line camelcase
  filter_property?: string
  // eslint-disable-next-line camelcase
  filter_value?: string
}

export enum Mode {
  BROWSER = 'BROWSER', // User browses by category
  EXPLORER = 'EXPLORER', // User explores around
}

export enum MapStyleEnum {
  vector = 'vector',
  raster = 'raster',
  aerial = 'aerial',
}

export type NavMenuEntry = {
  // eslint-disable-next-line camelcase
  post_id: number
  title: string
  url: string
}
