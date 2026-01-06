import { stringifyOptions } from '~/lib/apiPois'
import type { ApiPoisOptions } from '~/lib/apiPois'
import type { ApiPoiResponse } from '~/types/api/poi'
import type { ApiPoiDeps } from '~/types/api/poi-deps'
import type { PoiDeps } from '~/types/local/poi-deps'

export enum ApiRouteWaypointType {
  parking = 'parking',
  start = 'start',
  end = 'end',
  way_point = 'way_point',
}

export function prepareApiPoiDeps(
  featureCollection: ApiPoiDeps[],
  referenceIds?: number[],
): {
    waypoints: ApiPoiDeps[]
    pois: ApiPoiResponse[]
  } {
  const waypoints: ApiPoiDeps[] = []
  const pois: ApiPoiResponse[] = []

  if (referenceIds && referenceIds.length > 0) {
    for (const id of referenceIds) {
      const feature = Object.values(featureCollection).find(f => f.properties.metadata.id === id)

      if (!feature) {
        console.error(`Feature ${id} in dep_ids but not in collection.`)
        continue
      }

      if (feature.properties['route:point:type']) {
        waypoints.push(feature as ApiPoiDeps)
      }
      else {
        pois.push(feature as ApiPoiResponse)
      }
    }
  }

  return { waypoints, pois }
}

export async function getPoiDepsById(
  poiId: number | string,
  options: ApiPoisOptions = {},
): Promise<ApiPoiDeps> {
  const apiEndpoint = useState('api-endpoint')

  return await fetch(
    `${apiEndpoint.value}/poi/${poiId}/deps.geojson?${
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
  waypoint: ApiPoiDeps,
  colorFill: string,
  colorLine: string,
  colorText: '#000000' | '#FFFFFF',
  text?: string,
): PoiDeps {
  return {
    ...waypoint,
    properties: {
      ...waypoint.properties,
      name: waypoint.properties.name,
      description: waypoint.properties.description,
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
            render: 'text',
          },
          {
            field: 'coordinates',
            render: 'coordinates',
            label: true,
          },
        ],
      },
    },
  }
}
