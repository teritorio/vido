import { ApiPois, VidoFeature } from '@/utils/types'

export function getPoiById(
  apiEndpoint: string,
  apiProject: string,
  apiTheme: string,
  poiId: Number | string
): Promise<VidoFeature | null> {
  return fetch(
    `${apiEndpoint}/${apiProject}/${apiTheme}/poi/${poiId}`
  ).then((data) => (data.ok ? data.json() : null))
}

export function getPoiByIds(
  apiEndpoint: string,
  apiProject: string,
  apiTheme: string,
  poiIds: [string]
): Promise<ApiPois | null> {
  return fetch(
    `${apiEndpoint}/${apiProject}/${apiTheme}/pois?ids=${poiIds.join(',')}`
  ).then((data) => (data.ok ? ((data.json() as unknown) as ApiPois) : null))
}
