import type GeoJSON from 'geojson'
import { LngLatBounds } from 'maplibre-gl'
import { bbox as turfBbox } from '@turf/bbox'

type ITLngLatBounds = InstanceType<typeof LngLatBounds>

export function getBBox(data: GeoJSON.Feature | GeoJSON.FeatureCollection): LngLatBounds {
  const bbox = turfBbox(data)

  return new LngLatBounds(
    [bbox[0], bbox[1]],
    [bbox[2], bbox[3]],
  )
}

export function getBBoxCoordList(coordinates: [[number, number]]) {
  return coordinates.reduce(
    (bounds: ITLngLatBounds, coord: [number, number]) => {
      return bounds ? bounds.extend(coord) : new LngLatBounds(coord, coord)
    },
    null as unknown as ITLngLatBounds,
  )
}
