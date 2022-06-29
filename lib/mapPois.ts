import { MapGeoJSONFeature } from 'maplibre-gl'

import { ApiPoi, ApiPoiId, ApiPoiPropertiesArray } from './apiPois'

export interface MapPoi extends MapGeoJSONFeature {}

function split(value: string | undefined): string[] | undefined {
  return value
    ? value
        .split(';')
        .map((s: string) => s.trim())
        .filter((s: string) => s)
    : undefined
}

export function mapPoi2ApiPoi(mapPoi: MapPoi): ApiPoi {
  const props = Object.fromEntries(
    Object.entries(mapPoi.properties).map(([key, value]) => [
      key,
      value && ApiPoiPropertiesArray.includes(key) ? split(value) : value,
    ])
  )

  props.metadata = {
    id: mapPoi.id as ApiPoiId,
    category_ids: split(props.category_ids),
  }
  delete props.category_ids

  props.display = {
    icon: props.subclass || props.class || props.superclass,
    color_fill: props.color_fill,
    color_line: props.color_line,
    style_class: [props.superclass, props.class, props.subclass],
  }
  delete props.subclass
  delete props.class
  delete props.superclass
  delete props.color_fill
  delete props.color_line

  props.editorial = {
    popup_properties: split(props.popup_properties),
  }
  delete props.popup_properties

  delete props.priority
  delete props.rank
  delete props.style
  delete props.zoom

  mapPoi.properties = props
  return mapPoi as unknown as ApiPoi
}
