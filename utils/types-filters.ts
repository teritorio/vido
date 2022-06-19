import { FilterBoolean, FilterList, FilterDate, Filter } from '~/lib/apiMenu'
import { ApiPoi } from '~/lib/apiPois'

abstract class FilterValueDef<Type extends Filter> {
  def: Type
  type: Type['type']

  constructor(def: Type) {
    this.def = def
    this.type = def.type
  }

  abstract isSet(): boolean
  abstract isMatch(properties: ApiPoi['properties']): boolean
  toJSON() {
    return { ...this }
  }
}

export class FilterValueList extends FilterValueDef<FilterList> {
  filterValues: string[] = []

  isSet() {
    return this.filterValues.length > 0
  }

  isMatch(properties: ApiPoi['properties']) {
    const propertyValues = properties[this.def.property]
    if (propertyValues instanceof Array) {
      return this.filterValues.some((filterValue) =>
        propertyValues.includes(filterValue)
      )
    } else {
      return this.filterValues.includes(properties[this.def.property] as string)
    }
  }
}

export class FilterValueBoolean extends FilterValueDef<FilterBoolean> {
  filterValue: boolean = false

  isSet() {
    return this.filterValue
  }

  isMatch(properties: ApiPoi['properties']) {
    return Boolean(properties[this.def.property])
  }
}

export class FilterValueDate extends FilterValueDef<FilterDate> {
  filterValueBegin: String | null = null
  filterValueEnd: String | null = null

  isSet() {
    return this.filterValueBegin !== null || this.filterValueEnd !== null
  }

  isMatch(properties: ApiPoi['properties']) {
    return Boolean(
      (!this.def.property_begin ||
        !this.filterValueEnd ||
        properties[this.def.property_begin] <= this.filterValueEnd) &&
        (!this.def.property_end ||
          !this.filterValueBegin ||
          properties[this.def.property_end] >= this.filterValueBegin)
    )
  }
}

export type FilterValue = FilterValueList | FilterValueBoolean | FilterValueDate
export type FilterValues = FilterValue[]

export function filterValuesIsSet(filterValues: FilterValues) {
  return filterValues.some((filterValue) => filterValue.isSet())
}

export function filterValueFactory(filter: Filter): FilterValue {
  switch (filter.type) {
    case 'boolean':
      return new FilterValueBoolean(filter)
    case 'checkboxes_list':
    case 'multiselection':
      return new FilterValueList(filter)
    case 'date_range':
      return new FilterValueDate(filter)
  }
}
