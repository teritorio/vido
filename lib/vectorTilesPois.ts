import type { MapGeoJSONFeature } from 'maplibre-gl'
import type { Poi } from '~/types/local/poi'

export type VectorTilesPoi = MapGeoJSONFeature

const ApiPoiPropertiesArray = [
  'image',
  'phone',
  'mobile',
  'email',
  'website',
]

function split(value: string | undefined): string[] | undefined {
  return value
    ? value
      .split(';')
      .map((s: string) => s.trim())
      .filter((s: string) => s)
    : undefined
}

export function vectorTilesPoi2ApiPoi(mapPoi: VectorTilesPoi): Poi {
  const props = Object.fromEntries(
    Object.entries(mapPoi.properties).map(([key, value]) => [
      key,
      value && ApiPoiPropertiesArray.includes(key) ? split(value) : value,
    ]),
  )

  props.metadata = {
    id: mapPoi.id,
    category_ids: split(props.category_ids),
  }
  delete props.category_ids

  props.display = {
    icon: props.subclass || props.class || props.superclass,
    style_class: [props.superclass, props.class, props.subclass],
  }

  delete props.subclass
  delete props.class
  delete props.superclass
  delete props.color_fill
  delete props.color_line

  if (props.popup_fields) {
    props.editorial = {
      popup_fields: JSON.parse(props.popup_fields),
    }
    delete props.popup_fields
  }

  delete props.priority
  delete props.rank
  delete props.style
  delete props.zoom

  mapPoi.properties = props
  return mapPoi as unknown as Poi
}
