import { ApiPois } from '@/utils/types'

export function getPoiById(apiEndpoint: string, poiId: string) {
  return fetch(`${apiEndpoint}/geodata/v0.1/poi/${poiId}`).then((data) =>
    data.json()
  )
}

export function getPoiByIds(apiEndpoint: string, poiIds: [string]) {
  return fetch(`${apiEndpoint}/geodata/v0.1/pois?ids=${poiIds.join(',')}`).then(
    (data) => (data.json() as unknown) as ApiPois
  )
}
