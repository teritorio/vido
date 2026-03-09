import type { ApiPoi, ApiPoiCollection } from '~/types/api/poi'

export interface ApiPoisOptions {
  cliping_polygon_slug?: string
  geometry_as?: 'point' | 'bbox' | 'point_or_bbox'
  short_description?: boolean
  format?: 'geojson' | 'csv'
}

export const defaultOptions: ApiPoisOptions = {
  geometry_as: 'bbox',
  short_description: true,
  format: 'geojson',
}

export function stringifyOptions(options: ApiPoisOptions): string[][] {
  return Object.entries(Object.assign({}, defaultOptions, options))
    .filter(([k, _v]) => k !== 'format')
    .map(([k, v]) => [k, `${v}`])
}

export function getPoiById(
  apiEndpoint: string,
  poiId: number | string,
  options: ApiPoisOptions = {},
): Promise<ApiPoi> {
  return fetch(
    `${apiEndpoint}/poi/${poiId}.${options.format || defaultOptions.format}?${new URLSearchParams(stringifyOptions(options))}`,
  )
    .then((data) => {
      if (data.ok) {
        return data.json() as unknown as ApiPoi
      }
      else {
        return Promise.reject(
          new Error([data.url, data.status, data.statusText].join(' ')),
        )
      }
    })
}

export async function getPois(
  apiEndpoint: string,
  poiIds?: (number | string)[],
  options: ApiPoisOptions = {},
): Promise<ApiPoiCollection> {
  return await fetch(
    `${apiEndpoint}/pois.${options.format || defaultOptions.format}?${
      new URLSearchParams([
        ...(poiIds ? [['ids', poiIds.join(',')]] : []),
        ...stringifyOptions(options),
      ])}`,
  ).then((data) => {
    if (data.ok) {
      return data.json() as unknown as ApiPoiCollection
    }
    else {
      return Promise.reject(
        new Error([data.url, data.status, data.statusText].join(' ')),
      )
    }
  })
}

export function getPoiByCategoryIdUrl(
  apiEndpoint: string,
  categoryId: number | string,
  options: ApiPoisOptions = {},
): string {
  options = Object.assign({}, defaultOptions, { geometry_as: 'point' }, options)
  return (
    `${apiEndpoint}/pois/category/${categoryId}.${options.format}?${
    new URLSearchParams(stringifyOptions(options))}`
  )
}

export async function getPoiByCategoryId(
  apiEndpoint: string,
  categoryId: number | string,
  options: ApiPoisOptions = {},
): Promise<ApiPoiCollection> {
  options = Object.assign({}, defaultOptions, { geometry_as: 'point' }, options)

  return await fetch(getPoiByCategoryIdUrl(apiEndpoint, categoryId, options)).then(
    async (data) => {
      if (data.ok) {
        return await data.json() as unknown as ApiPoiCollection
      }
      else {
        return Promise.reject(
          new Error([data.url, data.status, data.statusText].join(' ')),
        )
      }
    },
  )
}
