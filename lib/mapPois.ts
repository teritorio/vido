import { MapGeoJSONFeature } from 'maplibre-gl'

import { ApiPoi, ApiPoiId } from './apiPois'

export interface MapPoi extends MapGeoJSONFeature {}

function colorFill(poi: MapPoi): string | undefined {
  if (poi.layer.paint) {
    const tc =
      poi.layer.type === 'fill'
        ? // @ts-ignore
          poi.layer.paint['fill-color']
        : poi.layer.type === 'symbol'
        ? // and then
          // @ts-ignore
          poi.layer.paint['text-color']
        : poi.layer.type === 'line'
        ? // @ts-ignore
          poi.layer.paint['line-color']
        : undefined
    if (tc) {
      return `rgba(${Math.round(tc.r * 255).toFixed(0)}, ${Math.round(
        tc.g * 255
      ).toFixed(0)}, ${Math.round(tc.b * 255).toFixed(0)}, ${tc.a})`
    }
  }
}

function colorLine(poi: MapPoi): string | undefined {
  if (poi.layer.paint) {
    const tc =
      poi.layer.type === 'symbol'
        ? // @ts-ignore
          poi.layer.paint['text-color']
        : poi.layer.type === 'line'
        ? // @ts-ignore
          poi.layer.paint['line-color']
        : // and then
        poi.layer.type === 'fill'
        ? // @ts-ignore
          poi.layer.paint['fill-color']
        : undefined
    if (tc) {
      return `rgba(${Math.round(tc.r * 255).toFixed(0)}, ${Math.round(
        tc.g * 255
      ).toFixed(0)}, ${Math.round(tc.b * 255).toFixed(0)}, ${tc.a})`
    }
  }
}

function icon(poi: MapPoi): string | undefined {
  if (poi.layer.type === 'symbol') {
    // @ts-ignore
    const name = poi.layer.layout?.['icon-image']?.name
    if (name) {
      return 'teritorio teritorio-' + name.replace(/[•◯⬤]/g, '')
    }
  }
}

export function mapPoi2ApiPoi(mapPoi: MapPoi): ApiPoi {
  const props = Object.fromEntries(
    Object.entries(mapPoi.properties).map(([key, value]) => [
      key,
      (key !== 'opening_hours' &&
        value &&
        typeof value === 'string' &&
        value.includes(';') &&
        value
          .split(';')
          .filter((s: string) => s)
          .map((s: string) => s.trim())
          .filter((s: string) => s)) ||
        value,
    ])
  )
  props.metadata = { id: mapPoi.id as ApiPoiId }
  props.display = {
    icon: icon(mapPoi),
    color_fill: colorFill(mapPoi),
    color_line: colorLine(mapPoi),
  }
  mapPoi.properties = props
  return mapPoi as unknown as ApiPoi
}
