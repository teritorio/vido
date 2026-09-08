import type { optional_conf } from 'opening_hours'
import OpeningHours from 'opening_hours'
import type { ApiPoiPropertiesStartEndDate } from '~/types/api/poi'
import type { Poi } from '~/types/local/poi'
import { useSiteStore } from '~/stores/site'
import type { FilterValueDate } from '~/utils/types-filters'
import { getNestedPropertyValue, isFieldMultilingual } from '~/utils/property'

export function useDateRangeFilter() {
  const { settings } = useSiteStore()
  const nominatim = settings?.bbox_line && settings.default_country && settings.default_country_state_opening_hours
    ? {
        lon: (settings.bbox_line.coordinates[0][0] + settings.bbox_line.coordinates[1][0]) / 2,
        lat: (settings.bbox_line.coordinates[0][1] + settings.bbox_line.coordinates[1][1]) / 2,
        address: {
          country_code: settings.default_country,
          state: settings.default_country_state_opening_hours,
        },
      }
    : null

  function isDateRangeMatch(filter: FilterValueDate, properties: Poi['properties']): boolean {
    const openingHoursStr = typeof properties.opening_hours === 'string' ? properties.opening_hours : undefined

    if (openingHoursStr && nominatim) {
      try {
        const oh = new OpeningHours(openingHoursStr, nominatim, {
          tag_key: 'opening_hours',
          mode: undefined,
          map_value: undefined,
          warnings_severity: undefined,
          locale: undefined,
        } satisfies optional_conf)
        const from = filter.filterValueBegin ? new Date(filter.filterValueBegin) : new Date()
        const to = filter.filterValueEnd ? new Date(`${filter.filterValueEnd}T23:59:59`) : new Date()
        const it = oh.getIterator(from)
        if (it.getState())
          return true
        while (it.advance(to)) {
          if (it.getState())
            return true
        }
        return false
      }
      catch {
        // fall through to start/end date fallback
      }
    }

    // Fallback: start_date/end_date overlap (original behaviour for non-event POIs)
    const multilingual = isFieldMultilingual(properties.editorial, filter.def.property)
    const propertyValue = getNestedPropertyValue(properties, filter.def.property, multilingual)
    const startDate = (propertyValue as ApiPoiPropertiesStartEndDate)?.start_date
    const endDate = (propertyValue as ApiPoiPropertiesStartEndDate)?.end_date
    return Boolean(
      (!filter.filterValueEnd || (startDate && startDate <= filter.filterValueEnd))
      && (!filter.filterValueBegin || (endDate && endDate >= filter.filterValueBegin)),
    )
  }

  return { isDateRangeMatch }
}
