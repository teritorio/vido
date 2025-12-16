import type { ApiPoi, ApiPoiId, FieldsListItem } from '~/lib/apiPois'
import type { ApiAddrSearchResult } from '~/lib/apiSearch'
import { MAP_ZOOM } from '~/lib/constants'
import { ADDRESS_FIELDS } from '~/composables/useField'

export function formatDate(date: Date): string {
  return (
    `${date.getFullYear().toString()
    }-${
    (date.getMonth() + 1).toString().padStart(2, '0')
    }-${
    date.getDate().toString().padStart(2, '0')}`
  )
}

export function isFiledEmpty(
  field: FieldsListItem,
  properties: { [key: string]: string },
  geom: GeoJSON.Geometry,
): boolean {
  if (field.field === 'route') {
    return !(
      Object.entries(properties || {})
        .map(([key, value]) => [key.split(':'), value])
        .filter(([keys, _value]) => keys[0] === 'route' && keys.length === 3)
        .length > 0
    )
  }

  if (field.field === 'addr') {
    return ADDRESS_FIELDS.reduce(
      (sum: boolean, value) => sum || value in properties,
      false,
    )
  }

  if (field.field === 'start_end_date')
    return isDateRangeEmpty(properties)

  if (field.field === 'coordinates')
    return isCoordinatesEmpty(geom)

  return !(field.field in properties)
}

export function isCoordinatesEmpty(geom: GeoJSON.Geometry): boolean {
  return !(geom && geom.type === 'Point' && geom.coordinates)
}

export function isDateRangeEmpty(properties: {
  [key: string]: string
}): boolean {
  return !('start' in properties) && !('end' in properties)
}

export function flattenFeatures(features: { [categoryId: number]: ApiPoi[] }) {
  return Object.values(features)
    .flat()
    .filter((f: ApiPoi) => f.properties.vido_visible)
}

export function getPreviousMonday() {
  const date = new Date()

  if (date.getDay() !== 0)
    return new Date().setDate(date.getDate() - 7 - 6)

  return new Date().setDate(date.getDate() - date.getDate() - 6)
}

export function formatApiAddressToFeature(feature: GeoJSON.Feature<GeoJSON.Point, ApiAddrSearchResult>, isGeocoding: boolean = false): ApiPoi {
  let vido_zoom = null

  if (isGeocoding) {
    vido_zoom = feature.properties.type === 'municipality'
      ? MAP_ZOOM.selectionZoom.municipality
      : MAP_ZOOM.selectionZoom.streetNumber
  }

  return {
    type: 'Feature',
    geometry: feature.geometry,
    properties: {
      internalType: 'address',
      metadata: {
        id: feature.properties.id as ApiPoiId,
      },
      name: feature.properties.label,
      vido_zoom,
      display: {
        icon: feature.properties.type === 'municipality'
          ? 'city'
          : 'map-marker-alt',
        color_fill: '#AAA',
        color_line: '#AAA',
      },
      editorial: {
        popup_fields: [{ field: 'name', render: 'string' }],
      },
    },
  }
}
