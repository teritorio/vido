import mapboxgl from 'maplibre-gl'

export const getBBoxFeatures = (
  features: GeoJSON.Feature[]
): mapboxgl.LngLatBounds => {
  return features.reduce(
    (
      bounds: mapboxgl.LngLatBounds | null,
      coord: GeoJSON.Feature<GeoJSON.Geometry>
    ) =>
      bounds ? bounds.extend(getBBoxFeature(coord)) : getBBoxFeature(coord),
    (null as unknown) as mapboxgl.LngLatBounds
  )
}

export const getBBoxFeature = (
  feature: GeoJSON.Feature
): mapboxgl.LngLatBounds => {
  switch (feature.geometry.type) {
    case 'LineString':
      return (feature.geometry.coordinates as [[number, number]]).reduce(
        (bounds: mapboxgl.LngLatBounds, coord: [number, number]) => {
          return bounds.extend(coord)
        },
        new mapboxgl.LngLatBounds(
          feature.geometry.coordinates[0] as [number, number],
          feature.geometry.coordinates[0] as [number, number]
        )
      )

    case 'Polygon':
      return (feature.geometry.coordinates[0] as [[number, number]]).reduce(
        (bounds: mapboxgl.LngLatBounds, coord: [number, number]) => {
          return bounds.extend(coord)
        },
        new mapboxgl.LngLatBounds(
          feature.geometry.coordinates[0][0] as [number, number],
          feature.geometry.coordinates[0][0] as [number, number]
        )
      )

    case 'Point':
      return new mapboxgl.LngLatBounds(
        feature.geometry.coordinates as [number, number],
        feature.geometry.coordinates as [number, number]
      )

    default:
      return new mapboxgl.LngLatBounds([-180, -90], [180, 90])
  }
}

export const getBBoxCoordList = (coordinates: [[number, number]]) => {
  return coordinates.reduce(
    (bounds: mapboxgl.LngLatBounds, coord: [number, number]) => {
      return bounds
        ? bounds.extend(coord)
        : new mapboxgl.LngLatBounds(coord, coord)
    },
    (null as unknown) as mapboxgl.LngLatBounds
  )
}
