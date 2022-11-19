import GeoJSON from 'geojson'

export function coordinatesHref(
  geometry: GeoJSON.Geometry,
  isIOS: boolean | undefined
): string | undefined {
  if (isIOS !== undefined && geometry.type === 'Point') {
    const lat = geometry.coordinates[1]
    const lng = geometry.coordinates[0]
    const latLng = `${lat},${lng}`
    return isIOS ? `maps://?q=${latLng}` : `geo:${latLng}?q=${latLng}`
  } else {
    return undefined
  }
}
