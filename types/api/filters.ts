export interface FilterList {
  type: 'multiselection' | 'checkboxes_list'
  property: string[]
  name?: MultilingualString
  values: Array<{
    value: string
    name: MultilingualString
  }>
}

export interface FilterBoolean {
  type: 'boolean'
  property: string[]
  name?: MultilingualString
}

export interface FilterDate {
  type: 'date_range'
  property: string[]
  name?: MultilingualString
}

export interface FilterNumberRange {
  type: 'number_range'
  property: string[]
  name?: MultilingualString
  min: number
  max: number
}

export type Filters = FilterList | FilterBoolean | FilterDate | FilterNumberRange
