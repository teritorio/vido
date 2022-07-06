import { MultilingualString } from '~/utils/types'

export interface ApiPoiId extends Number {}

export interface ApiPoiProperties {
  [key: string]: any

  name?: string

  image?: string[]
  // eslint-disable-next-line camelcase
  'image:thumbnail'?: string

  'addr:city'?: string
  'addr:housenumber'?: string
  'addr:postcode'?: string
  'addr:street'?: string

  phone?: string[]
  email?: string[]
  website?: string[]

  metadata: {
    id: ApiPoiId
    source?: string
    // eslint-disable-next-line camelcase
    category_ids?: Array<number>
  }
  display?: {
    icon: string
    // eslint-disable-next-line camelcase
    color_fill: string
    // eslint-disable-next-line camelcase
    color_line: string
    // eslint-disable-next-line camelcase
    style_class?: string[]
  }
  editorial?: {
    // eslint-disable-next-line camelcase
    popup_properties?: string[]
    // eslint-disable-next-line camelcase
    details_properties?: string[]
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
  as_point?: boolean
  // eslint-disable-next-line camelcase
  short_description?: boolean
}

const defaultOptions: apiPoisOptions = {
  as_point: true,
  short_description: true,
}

function stringifyOptions(options: apiPoisOptions): string[][] {
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
    `${apiEndpoint}/${apiProject}/${apiTheme}/poi/${poiId}?` +
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
    `${apiEndpoint}/${apiProject}/${apiTheme}/pois?` +
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
    `${apiEndpoint}/${apiProject}/${apiTheme}/pois?` +
      new URLSearchParams([
        ['idmenu', `${categoryId}`],
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
