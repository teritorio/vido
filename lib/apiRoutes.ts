import {
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
  name?: MultilingualString
  description?: MultilingualString

  'route:point:type': ApiRouteWaypointType
}

export interface ApiRoutePoint
  extends GeoJSON.Feature<GeoJSON.Point, ApiRouteWaypointProperties> {}

export interface ApiRoute
  extends GeoJSON.FeatureCollection<
    GeoJSON.Geometry,
    ApiPoiProperties | ApiRouteWaypointProperties
  > {}

export function getRouteById(
  apiEndpoint: string,
  apiProject: string,
  apiTheme: string,
  poiId: ApiPoiId | string,
  options: apiPoisOptions = {}
): Promise<ApiRoute> {
  return fetch(
    `${apiEndpoint}/${apiProject}/${apiTheme}/route/${poiId}.geojson?` +
      new URLSearchParams(stringifyOptions(options))
  ).then((data) => {
    if (data.ok) {
      return data.json() as unknown as ApiRoute
    } else {
      return Promise.reject(
        new Error([data.url, data.status, data.statusText].join(' '))
      )
    }
  })
}
