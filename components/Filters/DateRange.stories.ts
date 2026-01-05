import DateRange from '~/components/Filters/DateRange.vue'
import type { FilterDate } from '~/types/api/filters'
import { bind } from '~/lib/storybook-types'
import { FilterValueDate } from '~/utils/types-filters'

export default {
  title: 'Filters/DateRange',
  component: DateRange,
}

const def: FilterDate = {
  type: 'date_range',
  property_begin: 'begin',
  property_end: 'end',
  name: { fr: 'plop' },
}

const filter = new FilterValueDate(def)
filter.filterValueBegin = '01/01/01'
filter.filterValueEnd = '02/02/02'

const defaultProps = {
  filter,
}

export const Default = bind(DateRange, {
  ...defaultProps,
})
