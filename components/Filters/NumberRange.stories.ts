import NumberRange from '~/components/Filters/NumberRange.vue'
import type { FilterNumberRange } from '~/types/api/filters'
import { bind } from '~/lib/storybook-types'
import { FilterValueNumberRange } from '~/utils/types-filters'

export default {
  title: 'Filters/NumberRange',
  component: NumberRange,
}

const def: FilterNumberRange = {
  type: 'number_range',
  property: ['string'],
  name: { fr: 'plop' },
  min: 20,
  max: 120,
}

const filter = new FilterValueNumberRange(def)
filter.filterValueMin = 50
filter.filterValueMax = 70

const defaultProps = {
  filter,
}

export const Default = bind(NumberRange, {
  ...defaultProps,
})
