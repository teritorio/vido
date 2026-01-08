export type RenderEnum =
  | 'string'
  | 'text'
  | 'integer'
  | 'boolean'
  | 'weblink'
  | 'weblink@social-network'
  | 'weblink@download'
  | 'email'
  | 'phone'
  | 'date'
  | 'datetime'
  | 'duration'
  | 'start_end_date'
  | 'osm:opening_hours'
  | 'osm:collection_times'
  | 'osm:opening_hours+values'
  | 'image'
  | 'mapillary'
  | 'panoramax'
  | 'tag'
  | 'color'
  | 'rating-scale'
  | 'osm:stars'
  | 'addr'
  | 'route'
  | 'coordinates'

export interface FieldsListItem {
  label?: boolean
  field: string
  multilingual?: boolean
  array?: boolean
  render?: RenderEnum
  icon?: string
}

export interface FieldsListGroup {
  group: string
  label?: boolean
  display_mode?: 'standard' | 'card'
  icon?: string
  fields: FieldsList
}

export type FieldsList = (FieldsListItem | FieldsListGroup)[]
