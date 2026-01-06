import type { ApiPoiDeps, ApiRouteWaypointType } from '~/types/api/poi-deps'
import type { Poi } from '~/types/local/poi'

export const iconMap = {
  parking: 'square-parking',
  start: 'house-flag',
  end: 'flag-checkered',
  waypoint: 'map-marker-alt',
} as const satisfies Record<ApiRouteWaypointType, string>

export type PoiDeps = ApiPoiDeps

export type PoiUnion = Poi | PoiDeps
