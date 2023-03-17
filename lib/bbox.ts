import GeoJSON, { Geometry } from 'geojson'
import maplibregl from 'maplibre-gl'

export const getBBoxFeatures = (
  features: GeoJSON.Feature[]
): maplibregl.LngLatBounds | null => {
  return features.reduce(
    (
      bounds: maplibregl.LngLatBounds | null,
      coord: GeoJSON.Feature<GeoJSON.Geometry>
    ) =>
      bounds ? bounds.extend(getBBoxFeature(coord)) : getBBoxFeature(coord),
    null
  )
}

export const getBBoxFeature = (
  feature: GeoJSON.Feature | Geometry
): maplibregl.LngLatBounds => {
  const geometry: Geometry =
    feature.type == 'Feature' ? feature.geometry : feature
  switch (geometry.type) {
    case 'LineString':
      return (geometry.coordinates as [[number, number]]).reduce(
        (bounds: maplibregl.LngLatBounds, coord: [number, number]) => {
          return bounds.extend(coord)
        },
        new maplibregl.LngLatBounds(
          geometry.coordinates[0] as [number, number],
          geometry.coordinates[0] as [number, number]
        )
      )

    case 'Polygon':
      return (geometry.coordinates.flat(1) as [[number, number]]).reduce(
        (bounds: maplibregl.LngLatBounds, coord: [number, number]) => {
          return bounds.extend(coord)
        },
        new maplibregl.LngLatBounds(
          geometry.coordinates[0][0] as [number, number],
          geometry.coordinates[0][0] as [number, number]
        )
      )

    case 'MultiPolygon':
      return (geometry.coordinates.flat(2) as [[number, number]]).reduce(
        (bounds: maplibregl.LngLatBounds, coord: [number, number]) => {
          return bounds.extend(coord)
        },
        new maplibregl.LngLatBounds(
          geometry.coordinates[0][0][0] as [number, number],
          geometry.coordinates[0][0][0] as [number, number]
        )
      )

    case 'Point':
      return new maplibregl.LngLatBounds(
        geometry.coordinates as [number, number],
        geometry.coordinates as [number, number]
      )

    default:
      return new maplibregl.LngLatBounds([-180, -90], [180, 90])
  }
}

export const getBBoxCoordList = (coordinates: [[number, number]]) => {
  return coordinates.reduce(
    (bounds: maplibregl.LngLatBounds, coord: [number, number]) => {
      return bounds
        ? bounds.extend(coord)
        : new maplibregl.LngLatBounds(coord, coord)
    },
    null as unknown as maplibregl.LngLatBounds
  )
}
