export function getPoiById(apiEndpoint: string, poiId: string) {
  return fetch(`${apiEndpoint}/geodata/v1/allposts?post_id=${poiId}`)
    .then((data) => data.json())
    .then((data) =>
      Object.values(data)
        .flat()
        .filter((v) => v !== null)
        .map((v: any) => v.FeaturesCollection && v.FeaturesCollection.features)
        .flat()
        .filter((v) => v !== null)
        .pop()
    )
}
