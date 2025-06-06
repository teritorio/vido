import type { MapGeoJSONFeature } from 'maplibre-gl'
import type { ApiPoi, ApiPoiId } from './apiPois'
import { ApiPoiPropertiesArray } from './apiPois'
import { getContrastedColors } from '~/composables/useFeature'

export type VectorTilesPoi = MapGeoJSONFeature

function split(value: string | undefined): string[] | undefined {
  return value
    ? value
      .split(';')
      .map((s: string) => s.trim())
      .filter((s: string) => s)
    : undefined
}

export function vectorTilesPoi2ApiPoi(mapPoi: VectorTilesPoi): ApiPoi {
  const props = Object.fromEntries(
    Object.entries(mapPoi.properties).map(([key, value]) => [
      key,
      value && ApiPoiPropertiesArray.includes(key) ? split(value) : value,
    ]),
  )
  const { colorFill, colorText } = getContrastedColors(props.color_fill, props.color_text)

  props.metadata = {
    id: mapPoi.id as ApiPoiId,
    category_ids: split(props.category_ids),
  }
  delete props.category_ids

  props.display = {
    icon: props.subclass || props.class || props.superclass,
    color_fill: colorFill,
    color_line: props.color_line,
    color_text: colorText,
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
  return mapPoi as unknown as ApiPoi
}
