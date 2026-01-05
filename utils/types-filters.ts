import type {
  FilterBoolean,
  FilterDate,
  FilterList,
  FilterNumberRange,
  Filters,
} from '~/types/api/menu'
import type { ApiPoi } from '~/lib/apiPois'

abstract class FilterValueDef<Type extends Filters> {
  def: Type
  type: Type['type']

  constructor(def: Type) {
    this.def = def
    this.type = def.type
  }

  toJSON() {
    return { ...this }
  }
}

export class FilterValueList extends FilterValueDef<FilterList> {
  filterValues: string[] = []
}

export class FilterValueBoolean extends FilterValueDef<FilterBoolean> {
  filterValue = false
}

export class FilterValueDate extends FilterValueDef<FilterDate> {
  filterValueBegin: string | null = null
  filterValueEnd: string | null = null
}

export class FilterValueNumberRange extends FilterValueDef<FilterNumberRange> {
  filterValueMin: number | null = null
  filterValueMax: number | null = null
}

export type FilterValue =
  | FilterValueList
  | FilterValueBoolean
  | FilterValueDate
  | FilterValueNumberRange
export type FilterValues = FilterValue[]

export function isSet(filter: FilterValue): boolean {
  switch (filter.type) {
    case 'boolean':
      return filter.filterValue

    case 'checkboxes_list':
    case 'multiselection':
      return filter.filterValues.length > 0

    case 'date_range':
      return filter.filterValueBegin !== null || filter.filterValueEnd !== null

    case 'number_range':
      return (
        (filter.filterValueMin !== null
        && filter.filterValueMin !== filter.def.min)
        || (filter.filterValueMax !== null
        && filter.filterValueMax !== filter.def.max)
      )
  }
}

export function isMatch(
  filter: FilterValue,
  properties: ApiPoi['properties'],
): boolean {
  const propertyValues = 'property' in filter.def ? properties[filter.def.property] : null
  switch (filter.type) {
    case 'boolean':
      return Boolean(properties[filter.def.property])

    case 'checkboxes_list':
    case 'multiselection':
      if (Array.isArray(propertyValues)) {
        return filter.filterValues.some(filterValue =>
          propertyValues.includes(filterValue),
        )
      }
      else {
        return filter.filterValues.includes(
          properties[filter.def.property] as string,
        )
      }

    case 'date_range':
      return Boolean(
        (!filter.def.property_begin
        || !filter.filterValueEnd
        || properties[filter.def.property_begin] <= filter.filterValueEnd)
        && (!filter.def.property_end
        || !filter.filterValueBegin
        || properties[filter.def.property_end] >= filter.filterValueBegin),
      )

    case 'number_range':
      return (
        (filter.filterValueMin == null
        || filter.filterValueMin <= properties[filter.def.property])
        && (filter.filterValueMax == null
        || properties[filter.def.property] <= filter.filterValueMax)
      )
  }
}

export function filterValuesIsSet(filterValues: FilterValues) {
  return filterValues.some(filterValue => isSet(filterValue))
}

export function filterValueFactory(filter: Filters): FilterValue {
  switch (filter.type) {
    case 'boolean':
      return new FilterValueBoolean(filter).toJSON()
    case 'checkboxes_list':
    case 'multiselection':
      return new FilterValueList(filter).toJSON()
    case 'date_range':
      return new FilterValueDate(filter).toJSON()
    case 'number_range':
      return new FilterValueNumberRange(filter).toJSON()
  }
}
