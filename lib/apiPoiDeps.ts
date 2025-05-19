import type {
  ApiPoi,
  ApiPoiId,
  ApiPoiProperties,
  ApiPoisOptions,
} from './apiPois'
import {
  stringifyOptions,
} from './apiPois'

import type { MultilingualString } from '~/utils/types'
import type { VidoConfig } from '~/utils/types-config'

export enum ApiRouteWaypointType {
  parking = 'parking',
  start = 'start',
  end = 'end',
  way_point = 'way_point',
}

export interface ApiRouteWaypointProperties {
  'id': ApiPoiId
  'name'?: MultilingualString
  'description'?: MultilingualString
  'route:point:type': ApiRouteWaypointType
}

export type ApiRouteWaypoint = GeoJSON.Feature<
  GeoJSON.Point,
  ApiRouteWaypointProperties
>

export type ApiPoiDeps = GeoJSON.FeatureCollection<
  GeoJSON.Geometry,
  ApiPoiProperties | ApiRouteWaypointProperties
>

export async function getPoiDepsById(
  vidoConfig: VidoConfig,
  poiId: ApiPoiId | string,
  options: ApiPoisOptions = {},
): Promise<ApiPoiDeps> {
  return await fetch(
    `${vidoConfig.API_ENDPOINT}/${vidoConfig.API_PROJECT}/${vidoConfig.API_THEME}/poi/${poiId}/deps.geojson?${
      new URLSearchParams(stringifyOptions(options))}`,
  ).then((data) => {
    if (data.ok) {
      return data.json() as unknown as ApiPoiDeps
    }
    else {
      return Promise.reject(
        new Error([data.url, data.status, data.statusText].join(' ')),
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
  colorLine: string,
  colorText: '#000000' | '#FFFFFF',
  text?: string,
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
        color_text: colorText,
        text,
      },
      editorial: {
        popup_fields: [
          {
            field: 'short_description',
          },
          {
            field: 'coordinates',
            label: true,
          },
        ],
      },
    },
  }
}
