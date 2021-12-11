import { ApiPois } from '@/utils/types'

export function getPoiById(
  apiEndpoint: string,
  apiPoisSet: string,
  poiId: string
) {
  return fetch(`${apiEndpoint}/${apiPoisSet}/poi/${poiId}`).then((data) =>
    data.json()
  )
}

export function getPoiByIds(
  apiEndpoint: string,
  apiPoisSet: string,
  poiIds: [string]
) {
  return fetch(
    `${apiEndpoint}/${apiPoisSet}/pois?ids=${poiIds.join(',')}`
  ).then((data) => (data.json() as unknown) as ApiPois)
}
