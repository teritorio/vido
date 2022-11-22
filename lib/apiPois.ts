import { MapPoiProperties, MapPoiId } from './mapPois'

import { MultilingualString } from '~/utils/types'

export interface ApiPoiId extends MapPoiId {}

export type FieldsListItem = {
  label?: boolean
  field: string
}

export type FieldsListGroup = {
  group: string
  fields: FieldsListItem[]
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
    popup_fields?: FieldsList
    // eslint-disable-next-line camelcase
    details_fields?: FieldsList
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
export interface ApiPoi
  extends GeoJSON.Feature<GeoJSON.Geometry, ApiPoiProperties> {}

export const ApiPoiPropertiesArray = ['image', 'phone', 'email', 'website']

export interface ApiPois
  extends GeoJSON.FeatureCollection<GeoJSON.Geometry, ApiPoiProperties> {}

export interface apiPoisOptions {
  // eslint-disable-next-line camelcase
  geometry_as?: 'point' | 'bbox'
  // eslint-disable-next-line camelcase
  short_description?: boolean
}

export const defaultOptions: apiPoisOptions = {
  geometry_as: 'bbox',
  short_description: true,
}

export function stringifyOptions(options: apiPoisOptions): string[][] {
  return Object.entries(Object.assign({}, defaultOptions, options)).map(
    ([k, v]) => [k, `${v}`]
  )
}

export function getPoiById(
  apiEndpoint: string,
  apiProject: string,
  apiTheme: string,
  poiId: ApiPoiId | string,
  options: apiPoisOptions = {}
): Promise<ApiPoi> {
  return fetch(
    `${apiEndpoint}/${apiProject}/${apiTheme}/poi/${poiId}.geojson?` +
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

export function getPoiByIds(
  apiEndpoint: string,
  apiProject: string,
  apiTheme: string,
  poiIds: (ApiPoiId | string)[],
  options: apiPoisOptions = {}
): Promise<ApiPois> {
  return fetch(
    `${apiEndpoint}/${apiProject}/${apiTheme}/pois.geojson?` +
      new URLSearchParams([
        ['ids', poiIds.join(',')],
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

export function getPoiByCategoryId(
  apiEndpoint: string,
  apiProject: string,
  apiTheme: string,
  categoryId: number | string,
  options: apiPoisOptions = {}
): Promise<ApiPois> {
  return fetch(
    `${apiEndpoint}/${apiProject}/${apiTheme}/pois/category/${categoryId}.geojson?` +
      new URLSearchParams(stringifyOptions(options))
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
