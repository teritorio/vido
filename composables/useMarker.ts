import { type LngLatLike, Marker, type MarkerOptions } from 'maplibre-gl'

const defaultOptions = {
  scale: 1.3,
  color: '#f44336',
} satisfies MarkerOptions

export function createMarker(coords: LngLatLike, options: MarkerOptions = defaultOptions) {
  return new Marker(options).setLngLat(coords)
}

export default function () {
  return {
    createMarker,
  }
}
