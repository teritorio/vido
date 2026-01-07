export type RenderEnum =
  | 'string'
  | 'text'
  | 'integer'
  | 'boolean'
  | 'email'
  | 'phone'
  | 'date'
  | 'coordinates'
  | 'addr'
  | 'route'
  | 'datetime'
  | 'duration'
  | 'start_end_date'
  | 'image'
  | 'mapillary'
  | 'panoramax'
  | 'tag'
  | 'color'
  | 'rating-scale'
  | 'weblink'
  | 'weblink@social-network'
  | 'weblink@download'
  | 'osm:opening_hours'
  | 'osm:collection_times'
  | 'osm:stars'

export interface FieldsListItem {
  group?: undefined
  label?: boolean
  field: string
  render: RenderEnum
  icon?: string
  array?: boolean
  multilingual?: boolean
}

export interface FieldsListGroup {
  group: string
  fields: FieldsList
  display_mode: 'standard' | 'card'
  icon?: string
}

export type FieldsList = (FieldsListItem | FieldsListGroup)[]
