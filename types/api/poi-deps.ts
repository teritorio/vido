import type { ApiPoiProperties } from '~/types/api/poi'
import type { LanguageCode } from '~/utils/types'

export type ApiRouteWaypointType = 'parking' | 'start' | 'end' | 'waypoint'

export const ApiRouteWaypointTypeObject = {
  parking: 'parking',
  start: 'start',
  end: 'end',
  waypoint: 'waypoint',
} as const satisfies Record<string, ApiRouteWaypointType>

export interface ApiPoiDepsProperties extends ApiPoiProperties {
  'id': number
  'route:point:type'?: ApiRouteWaypointType
  'description'?: {
    [lang in LanguageCode]?: {
      value: string
      html: boolean
      is_shortened: boolean
    }
  }
}

export type ApiPoiDeps = GeoJSON.Feature<GeoJSON.Geometry, ApiPoiDepsProperties>

export type ApiPoiUnion = GeoJSON.Feature<GeoJSON.Geometry, ApiPoiProperties | ApiPoiDepsProperties>

export type ApiPoiDepsCollection = GeoJSON.FeatureCollection<GeoJSON.Geometry, ApiPoiProperties | ApiPoiDepsProperties>
