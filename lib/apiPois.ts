import type { MapPoiId, MapPoiProperties } from './mapPois'

import type { MultilingualString } from '~/utils/types'
import type { VidoConfig } from '~/utils/types-config'

export type ApiPoiId = MapPoiId

export interface FieldsListItem {
  group?: undefined
  label?: boolean
  field: string
}

export interface FieldsListGroup {
  group: string
  fields: FieldsList
  display_mode: 'standard' | 'card'
  icon?: string
}

export type FieldsList = (FieldsListItem | FieldsListGroup)[]
export type TextColors = '#000000' | '#FFFFFF'
export type ApiPoiProperties = MapPoiProperties & {
  'image'?: string[]
  'addr:city'?: string
  'addr:housenumber'?: string
  'addr:postcode'?: string
  'addr:street'?: string
  'phone'?: string[]
  'email'?: string[]
  'website'?: string[]
  'download'?: string[]
  'metadata': {
    id: ApiPoiId
    source?: string
    category_ids?: Array<number>
    updated_at?: string
    osm_id?: number
    osm_type?: 'node' | 'way' | 'relation'
    dep_ids?: number[]
  }
  'display'?: {
    style_class?: string[]
    color_fill: string
    color_line: string
    color_text?: TextColors
  }
  'editorial'?: {
    'popup_fields'?: FieldsListItem[]
    'details_fields'?: FieldsList
    'list_fields'?: FieldsListItem[]
    'class_label'?: MultilingualString
    'class_label_popup'?: MultilingualString
    'class_label_details'?: MultilingualString
    'website:details'?: string
    'unavoidable'?: boolean
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
  cliping_polygon_slug?: string
  geometry_as?: 'point' | 'bbox' | 'point_or_bbox'
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
    .filter(([k, _v]) => k !== 'format')
    .map(([k, v]) => [k, `${v}`])
}

export function getPoiById(
  vidoConfig: VidoConfig,
  poiId: ApiPoiId | string,
  options: ApiPoisOptions = {},
): Promise<ApiPoi> {
  const { apiEndpoint } = useApiEndpoint()
  return fetch(
    `${apiEndpoint.value}/${vidoConfig.API_PROJECT}/${
      vidoConfig.API_THEME
    }/poi/${poiId}.${options.format || defaultOptions.format}?${
      new URLSearchParams(stringifyOptions(options))}`,
  ).then((data) => {
    if (data.ok) {
      return data.json() as unknown as ApiPoi
    }
    else {
      return Promise.reject(
        new Error([data.url, data.status, data.statusText].join(' ')),
      )
    }
  })
}

export async function getPois(
  vidoConfig: VidoConfig,
  poiIds?: (ApiPoiId | string)[],
  options: ApiPoisOptions = {},
): Promise<ApiPois> {
  const { apiEndpoint } = useApiEndpoint()
  return await fetch(
    `${apiEndpoint.value}/${vidoConfig.API_PROJECT}/${
      vidoConfig.API_THEME
    }/pois.${options.format || defaultOptions.format}?${
      new URLSearchParams([
        ...(poiIds ? [['ids', poiIds.join(',')]] : []),
        ...stringifyOptions(options),
      ])}`,
  ).then((data) => {
    if (data.ok) {
      return data.json() as unknown as ApiPois
    }
    else {
      return Promise.reject(
        new Error([data.url, data.status, data.statusText].join(' ')),
      )
    }
  })
}

export function getPoiByCategoryIdUrl(
  vidoConfig: VidoConfig,
  categoryId: number | string,
  options: ApiPoisOptions = {},
): string {
  const { apiEndpoint } = useApiEndpoint()
  options = Object.assign(defaultOptions, { geometry_as: 'point' }, options)
  return (
    `${apiEndpoint.value}/${vidoConfig.API_PROJECT}/${vidoConfig.API_THEME}/pois/category/${categoryId}.${options.format}?${
    new URLSearchParams(stringifyOptions(options))}`
  )
}

export async function getPoiByCategoryId(
  vidoConfig: VidoConfig,
  categoryId: number | string,
  options: ApiPoisOptions = {},
): Promise<ApiPois> {
  options = Object.assign(defaultOptions, { geometry_as: 'point' }, options)
  return await fetch(getPoiByCategoryIdUrl(vidoConfig, categoryId, options)).then(
    (data) => {
      if (data.ok) {
        return data.json() as unknown as ApiPois
      }
      else {
        return Promise.reject(
          new Error([data.url, data.status, data.statusText].join(' ')),
        )
      }
    },
  )
}
