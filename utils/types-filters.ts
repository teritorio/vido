import type {
  FilterBoolean,
  FilterDate,
  FilterList,
  FilterNumberRange,
  Filters,
} from '~/types/api/filters'
import type { ApiPoiPropertiesStartEndDate } from '~/types/api/poi'
import type { Poi } from '~/types/local/poi'
import { getNestedPropertyValue, isFieldMultilingual } from '~/utils/property'

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
  properties: Poi['properties'],
): boolean {
  const multilingual = 'property' in filter.def ? isFieldMultilingual(properties.editorial, filter.def.property) : false
  const propertyValue = 'property' in filter.def ? getNestedPropertyValue(properties, filter.def.property, multilingual) : null
  switch (filter.type) {
    case 'boolean':
      return Boolean(propertyValue)

    case 'checkboxes_list':
    case 'multiselection':
      if (Array.isArray(propertyValue)) {
        return filter.filterValues.some(filterValue =>
          propertyValue.includes(filterValue),
        )
      }
      else {
        return filter.filterValues.includes(propertyValue as string)
      }

    case 'date_range':
      return Boolean(
        (!filter.filterValueEnd
        || ((propertyValue as ApiPoiPropertiesStartEndDate)?.start_date
        && (propertyValue as ApiPoiPropertiesStartEndDate).start_date <= filter.filterValueEnd))
        && (!filter.filterValueBegin
        || ((propertyValue as ApiPoiPropertiesStartEndDate)?.end_date
        && (propertyValue as ApiPoiPropertiesStartEndDate).end_date >= filter.filterValueBegin)),
      )

    case 'number_range':
      return (
        (filter.filterValueMin == null
        || filter.filterValueMin <= (propertyValue as number))
        && (filter.filterValueMax == null
        || (propertyValue as number) <= filter.filterValueMax)
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
