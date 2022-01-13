import { ApiPois } from '@/utils/types'

export function getPoiById(
  apiEndpoint: string,
  apiProject: string,
  apiTheme: string,
  poiId: string
) {
  return fetch(
    `${apiEndpoint}/${apiProject}/${apiTheme}/poi/${poiId}`
  ).then((data) => data.json())
}

export function getPoiByIds(
  apiEndpoint: string,
  apiProject: string,
  apiTheme: string,
  poiIds: [string]
) {
  return fetch(
    `${apiEndpoint}/${apiProject}/${apiTheme}/pois?ids=${poiIds.join(',')}`
  ).then((data) => (data.json() as unknown) as ApiPois)
}
