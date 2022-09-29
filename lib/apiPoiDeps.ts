import {
  ApiPoi,
  ApiPoiId,
  ApiPoiProperties,
  apiPoisOptions,
  stringifyOptions,
} from './apiPois'

import { MultilingualString } from '~/utils/types'

export enum ApiRouteWaypointType {
  parking = 'parking',
  start = 'start',
  end = 'end',
  way_point = 'way_point',
}

export interface ApiRouteWaypointProperties {
  id: ApiPoiId
  name?: MultilingualString
  description?: MultilingualString

  'route:point:type': ApiRouteWaypointType
}

export interface ApiRouteWaypoint
  extends GeoJSON.Feature<GeoJSON.Point, ApiRouteWaypointProperties> {}

export interface ApiPoiDeps
  extends GeoJSON.FeatureCollection<
    GeoJSON.Geometry,
    ApiPoiProperties | ApiRouteWaypointProperties
  > {}

export function getPoiDepsById(
  apiEndpoint: string,
  apiProject: string,
  apiTheme: string,
  poiId: ApiPoiId | string,
  options: apiPoisOptions = {}
): Promise<ApiPoiDeps> {
  return fetch(
    `${apiEndpoint}/${apiProject}/${apiTheme}/poi/${poiId}/deps.geojson?` +
      new URLSearchParams(stringifyOptions(options))
  ).then((data) => {
    if (data.ok) {
      return data.json() as unknown as ApiPoiDeps
    } else {
      return Promise.reject(
        new Error([data.url, data.status, data.statusText].join(' '))
      )
    }
  })
}

export const iconMap: { [key: string]: string } = {
  [ApiRouteWaypointType.parking]: 'square-parking',
  [ApiRouteWaypointType.start]: 'house-flag',
  [ApiRouteWaypointType.end]: 'flag-checkered',
  [ApiRouteWaypointType.way_point]: 'map-marker-alt',
}

export function apiRouteWaypointToApiPoi(
  waypoint: ApiRouteWaypoint,
  colorFill: string,
  colorLine: string
): ApiPoi {
  return {
    ...waypoint,
    properties: {
      ...waypoint.properties,
      name: waypoint.properties.name?.fr,
      description: waypoint.properties.description?.fr,
      metadata: {
        id: waypoint.properties.id,
      },
      display: {
        icon: iconMap[waypoint.properties['route:point:type']],
        color_fill: colorFill,
        color_line: colorLine,
      },
      editorial: {
        popup_fields: [
          {
            field: 'description',
          },
          {
            field: 'coordinates',
          },
        ],
      },
    },
  }
}
