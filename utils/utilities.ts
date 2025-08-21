import type { ApiPoi, ApiPoiId } from '~/lib/apiPois'
import type { ApiAddrSearchResult } from '~/lib/apiSearch'
import { MAP_ZOOM } from '~/lib/constants'

export function removeDuplicateAttributions(input: string) {
  const regex = /(<a[^>]*>.*?<\/a>)|([^<>]+)/g
  const matches = input.match(regex) || []

  const seen = new Set()
  const uniqueSegments = []

  for (const match of matches) {
    const trimmed = match.trim()
    if (trimmed && !seen.has(trimmed)) {
      seen.add(trimmed)
      uniqueSegments.push(match)
    }
  }

  return uniqueSegments.join(' ').replace(/\s+/g, ' ').trim()
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
        popup_fields: [{ field: 'name' }],
      },
    },
  }
}
