const handlePoiData = (data: any) =>
  Object.values(data)
    .flat()
    .filter((v) => v !== null)
    .map((v: any) => v.FeaturesCollection && v.FeaturesCollection.features)
    .flat()
    .filter((v) => v !== null)

export function getPoiById(apiEndpoint: string, poiId: string) {
  return fetch(`${apiEndpoint}/geodata/v0.1/poi/${poiId}`).then((data) =>
    data.json()
  )
}

export function getPoiByIds(apiEndpoint: string, poiIds: [string]) {
  return fetch(`${apiEndpoint}/geodata/v0.1/pois?ids=${poiIds.join(',')}`)
    .then((data) => data.json())
    .then((data) => handlePoiData(data))
}
