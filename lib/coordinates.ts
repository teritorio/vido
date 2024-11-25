import type GeoJSON from 'geojson'
import { isIOS } from '~/utils/isIOS'

export function coordinatesHref(geometry: GeoJSON.Geometry) {
  if (geometry.type !== 'Point')
    return undefined

  const lat = geometry.coordinates[1]
  const lng = geometry.coordinates[0]
  const latLng = `${lat},${lng}`
  return isIOS() ? `maps://?q=${latLng}` : `geo:${latLng}?q=${latLng}`
}
