import type { MultiPoint } from 'geojson'
import type { MapPoi } from '~/lib/mapPois'

export default function () {
  const flattenMultipoint = (features: MapPoi[]): MapPoi[] => {
    const explodedPointFeatures: MapPoi[] = []
    features.forEach((f: MapPoi) => {
      if (f.geometry.type === 'MultiPoint') {
        const { coordinates } = f.geometry as MultiPoint

        coordinates.forEach((coords: number[]) => {
          explodedPointFeatures.push({
            ...f,
            geometry: {
              type: 'Point',
              coordinates: coords,
            },
          })
        })
      }

      return f
    })

    features = features.filter(f => f.geometry.type !== 'MultiPoint')

    return [...features, ...explodedPointFeatures]
  }

  return {
    flattenMultipoint,
  }
}
