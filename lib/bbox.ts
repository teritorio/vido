import GeoJSON, { Geometry } from 'geojson'
import  { LngLatBounds } from 'maplibre-gl'

type ITLngLatBounds = InstanceType<typeof LngLatBounds>

export const getBBoxFeatures = (
  features: GeoJSON.Feature[]
): ITLngLatBounds | null => {
  return features.reduce(
    (bounds: ITLngLatBounds | null, coord: GeoJSON.Feature<GeoJSON.Geometry>) =>
      bounds ? bounds.extend(getBBoxFeature(coord)) : getBBoxFeature(coord),
    null
  )
}

export const getBBoxFeature = (
  feature: GeoJSON.Feature | Geometry
): ITLngLatBounds => {
  const geometry: Geometry =
    feature.type == 'Feature' ? feature.geometry : feature
  switch (geometry.type) {
    case 'LineString':
      return (geometry.coordinates as [[number, number]]).reduce(
        (bounds: ITLngLatBounds, coord: [number, number]) => {
          return bounds.extend(coord)
        },
        new LngLatBounds(
          geometry.coordinates[0] as [number, number],
          geometry.coordinates[0] as [number, number]
        )
      )

    case 'Polygon':
      return (geometry.coordinates.flat(1) as [[number, number]]).reduce(
        (bounds: ITLngLatBounds, coord: [number, number]) => {
          return bounds.extend(coord)
        },
        new LngLatBounds(
          geometry.coordinates[0][0] as [number, number],
          geometry.coordinates[0][0] as [number, number]
        )
      )

    case 'MultiPolygon':
      return (geometry.coordinates.flat(2) as [[number, number]]).reduce(
        (bounds: ITLngLatBounds, coord: [number, number]) => {
          return bounds.extend(coord)
        },
        new LngLatBounds(
          geometry.coordinates[0][0][0] as [number, number],
          geometry.coordinates[0][0][0] as [number, number]
        )
      )

    case 'Point':
      return new LngLatBounds(
        geometry.coordinates as [number, number],
        geometry.coordinates as [number, number]
      )

    default:
      return new LngLatBounds([-180, -90], [180, 90])
  }
}

export const getBBoxCoordList = (coordinates: [[number, number]]) => {
  return coordinates.reduce(
    (bounds: ITLngLatBounds, coord: [number, number]) => {
      return bounds ? bounds.extend(coord) : new LngLatBounds(coord, coord)
    },
    null as unknown as ITLngLatBounds
  )
}
