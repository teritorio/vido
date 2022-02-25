import { MultilingualString } from '@/utils/types'

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
    details_properties?: string[]
    // eslint-disable-next-line camelcase
    class_label?: MultilingualString
    // eslint-disable-next-line camelcase
    class_label_popup?: MultilingualString
    // eslint-disable-next-line camelcase
    class_label_details?: MultilingualString
    'website:details'?: string
  }
}
export interface ApiPoi
  extends GeoJSON.Feature<GeoJSON.Geometry, ApiPoiProperties> {}

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
  return Object.entries(
    Object.assign({}, defaultOptions, options)
  ).map(([k, v]) => [k, `${v}`])
}

export function getPoiById(
  apiEndpoint: string,
  apiProject: string,
  apiTheme: string,
  poiId: number | string,
  options: apiPoisOptions = {}
): Promise<ApiPoi | null> {
  return fetch(
    `${apiEndpoint}/${apiProject}/${apiTheme}/poi/${poiId}?` +
      new URLSearchParams(stringifyOptions(options))
  ).then((data) => (data.ok ? ((data.json() as unknown) as ApiPoi) : null))
}

export function getPoiByIds(
  apiEndpoint: string,
  apiProject: string,
  apiTheme: string,
  poiIds: (number | string)[],
  options: apiPoisOptions = {}
): Promise<ApiPois | null> {
  return fetch(
    `${apiEndpoint}/${apiProject}/${apiTheme}/pois?` +
      new URLSearchParams([
        ['ids', poiIds.join(',')],
        ...stringifyOptions(options),
      ])
  ).then((data) => (data.ok ? ((data.json() as unknown) as ApiPois) : null))
}

export function getPoiByCategoryId(
  apiEndpoint: string,
  apiProject: string,
  apiTheme: string,
  categoryId: number | string,
  options: apiPoisOptions = {}
): Promise<ApiPois | null> {
  return fetch(
    `${apiEndpoint}/${apiProject}/${apiTheme}/pois?` +
      new URLSearchParams([
        ['idmenu', `${categoryId}`],
        ...stringifyOptions(options),
      ])
  ).then((data) => (data.ok ? ((data.json() as unknown) as ApiPois) : null))
}