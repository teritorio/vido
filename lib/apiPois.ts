import { MapPoiProperties, MapPoiId } from './mapPois'

import { MultilingualString } from '~/utils/types'
import { VidoConfig } from '~/utils/types-config'

export type ApiPoiId = MapPoiId

export type FieldsListItem = {
  group?: undefined
  label?: boolean
  field: string
}

export type FieldsListGroup = {
  group: string
  fields: FieldsList
  // eslint-disable-next-line camelcase
  display_mode: 'standard' | 'card'
  icon: string
}

export type FieldsList = (FieldsListItem | FieldsListGroup)[]

export type ApiPoiProperties = MapPoiProperties & {
  image?: string[]

  'addr:city'?: string
  'addr:housenumber'?: string
  'addr:postcode'?: string
  'addr:street'?: string

  phone?: string[]
  email?: string[]
  website?: string[]
  download?: string[]

  metadata: {
    id: ApiPoiId
    source?: string
    // eslint-disable-next-line camelcase
    category_ids?: Array<number>
    // eslint-disable-next-line camelcase
    updated_at?: string
    // eslint-disable-next-line camelcase
    osm_id?: number
    // eslint-disable-next-line camelcase
    osm_type?: 'node' | 'way' | 'relation'
  }
  display?: {
    // eslint-disable-next-line camelcase
    style_class?: string[]
    // eslint-disable-next-line camelcase
    color_fill: string
    // eslint-disable-next-line camelcase
    color_line: string
    // eslint-disable-next-line camelcase
  }
  editorial?: {
    // eslint-disable-next-line camelcase
    popup_fields?: FieldsListItem[]
    // eslint-disable-next-line camelcase
    details_fields?: FieldsList
    // eslint-disable-next-line camelcase
    list_fields?: FieldsListItem[]
    // eslint-disable-next-line camelcase
    class_label?: MultilingualString
    // eslint-disable-next-line camelcase
    class_label_popup?: MultilingualString
    // eslint-disable-next-line camelcase
    class_label_details?: MultilingualString
    'website:details'?: string
    unavoidable?: boolean
  }
}
export type ApiPoi = GeoJSON.Feature<GeoJSON.Geometry, ApiPoiProperties>

export const ApiPoiPropertiesArray = [
  'image',
  'phone',
  'mobile',
  'email',
  'website',
]

export type ApiPois = GeoJSON.FeatureCollection<
  GeoJSON.Geometry,
  ApiPoiProperties
>

export interface ApiPoisOptions {
  // eslint-disable-next-line camelcase
  geometry_as?: 'point' | 'bbox'
  // eslint-disable-next-line camelcase
  short_description?: boolean
  format?: 'geojson' | 'csv'
}

export const defaultOptions: ApiPoisOptions = {
  geometry_as: 'bbox',
  short_description: true,
  format: 'geojson',
}

export function stringifyOptions(options: ApiPoisOptions): string[][] {
  return Object.entries(Object.assign({}, defaultOptions, options))
    .filter(([k, v]) => k != 'format')
    .map(([k, v]) => [k, `${v}`])
}

export function getPoiById(
  vidoConfig: VidoConfig,
  poiId: ApiPoiId | string,
  options: ApiPoisOptions = {}
): Promise<ApiPoi> {
  return fetch(
    `${vidoConfig.API_ENDPOINT}/${vidoConfig.API_PROJECT}/${
      vidoConfig.API_THEME
    }/poi/${poiId}.${options.format || defaultOptions.format}?` +
      new URLSearchParams(stringifyOptions(options))
  ).then((data) => {
    if (data.ok) {
      return data.json() as unknown as ApiPoi
    } else {
      return Promise.reject(
        new Error([data.url, data.status, data.statusText].join(' '))
      )
    }
  })
}

export function getPois(
  vidoConfig: VidoConfig,
  poiIds?: (ApiPoiId | string)[],
  options: ApiPoisOptions = {}
): Promise<ApiPois> {
  return fetch(
    `${vidoConfig.API_ENDPOINT}/${vidoConfig.API_PROJECT}/${
      vidoConfig.API_THEME
    }/pois.${options.format || defaultOptions.format}?` +
      new URLSearchParams([
        ...(poiIds ? [['ids', poiIds.join(',')]] : []),
        ...stringifyOptions(options),
      ])
  ).then((data) => {
    if (data.ok) {
      return data.json() as unknown as ApiPois
    } else {
      return Promise.reject(
        new Error([data.url, data.status, data.statusText].join(' '))
      )
    }
  })
}

export function getPoiByCategoryIdUrl(
  vidoConfig: VidoConfig,
  categoryId: number | string,
  options: ApiPoisOptions = {}
): string {
  options = Object.assign(defaultOptions, { geometry_as: 'point' }, options)
  return (
    `${vidoConfig.API_ENDPOINT}/${vidoConfig.API_PROJECT}/${vidoConfig.API_THEME}/pois/category/${categoryId}.${options.format}?` +
    new URLSearchParams(stringifyOptions(options))
  )
}

export function getPoiByCategoryId(
  vidoConfig: VidoConfig,
  categoryId: number | string,
  options: ApiPoisOptions = {}
): Promise<ApiPois> {
  options = Object.assign(defaultOptions, { geometry_as: 'point' }, options)
  return fetch(getPoiByCategoryIdUrl(vidoConfig, categoryId, options)).then(
    (data) => {
      if (data.ok) {
        return data.json() as unknown as ApiPois
      } else {
        return Promise.reject(
          new Error([data.url, data.status, data.statusText].join(' '))
        )
      }
    }
  )
}
