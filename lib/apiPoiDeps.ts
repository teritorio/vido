import { stringifyOptions } from '~/lib/apiPois'
import type { ApiPoisOptions } from '~/lib/apiPois'
import type { ApiPoiDeps } from '~/types/api/poi-deps'

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
