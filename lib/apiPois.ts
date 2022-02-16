import { MultilingualString } from '@/utils/types'

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
export interface VidoFeature
  extends GeoJSON.Feature<GeoJSON.Geometry, VidoFeatureProperties> {}

export interface ApiPois
  extends GeoJSON.FeatureCollection<GeoJSON.Geometry, VidoFeatureProperties> {}

export function getPoiById(
  apiEndpoint: string,
  apiProject: string,
  apiTheme: string,
  poiId: Number | string
): Promise<VidoFeature | null> {
  return fetch(
    `${apiEndpoint}/${apiProject}/${apiTheme}/poi/${poiId}`
  ).then((data) => (data.ok ? data.json() : null))
}

export function getPoiByIds(
  apiEndpoint: string,
  apiProject: string,
  apiTheme: string,
  poiIds: [string]
): Promise<ApiPois | null> {
  return fetch(
    `${apiEndpoint}/${apiProject}/${apiTheme}/pois?ids=${poiIds.join(',')}`
  ).then((data) => (data.ok ? ((data.json() as unknown) as ApiPois) : null))
}
