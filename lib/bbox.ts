import type { Geometry } from 'geojson'
import type GeoJSON from 'geojson'
import { LngLatBounds } from 'maplibre-gl'

type ITLngLatBounds = InstanceType<typeof LngLatBounds>

export function getBBoxFeatures(features: GeoJSON.Feature[]): ITLngLatBounds | undefined {
  return features.reduce(
    (bounds: ITLngLatBounds | undefined, coord: GeoJSON.Feature<GeoJSON.Geometry>) =>
      bounds ? bounds.extend(getBBoxFeature(coord)) : getBBoxFeature(coord),
    undefined,
  )
}

export function getBBoxFeature(feature: GeoJSON.Feature | Geometry): ITLngLatBounds {
  const geometry: Geometry
    = feature.type === 'Feature' ? feature.geometry : feature
  switch (geometry.type) {
    case 'LineString':
    case 'MultiPoint':
      return (geometry.coordinates as [[number, number]]).reduce(
        (bounds: ITLngLatBounds, coord: [number, number]) => {
          return bounds.extend(coord)
        },
        new LngLatBounds(
          geometry.coordinates[0] as [number, number],
          geometry.coordinates[0] as [number, number],
        ),
      )

    case 'Polygon':
      return (geometry.coordinates.flat(1) as [[number, number]]).reduce(
        (bounds: ITLngLatBounds, coord: [number, number]) => {
          return bounds.extend(coord)
        },
        new LngLatBounds(
          geometry.coordinates[0][0] as [number, number],
          geometry.coordinates[0][0] as [number, number],
        ),
      )

    case 'MultiPolygon':
      return (geometry.coordinates.flat(2) as [[number, number]]).reduce(
        (bounds: ITLngLatBounds, coord: [number, number]) => {
          return bounds.extend(coord)
        },
        new LngLatBounds(
          geometry.coordinates[0][0][0] as [number, number],
          geometry.coordinates[0][0][0] as [number, number],
        ),
      )

    case 'Point':
      return new LngLatBounds(
        geometry.coordinates as [number, number],
        geometry.coordinates as [number, number],
      )

    default:
      return new LngLatBounds([-180, -90], [180, 90])
  }
}

export function getBBoxCoordList(coordinates: [[number, number]]) {
  return coordinates.reduce(
    (bounds: ITLngLatBounds, coord: [number, number]) => {
      return bounds ? bounds.extend(coord) : new LngLatBounds(coord, coord)
    },
    null as unknown as ITLngLatBounds,
  )
}
