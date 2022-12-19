import DateRange from '~/components/Fields/DateRange.vue'
import { bind } from '~/lib/storybook-types'

export default {
  title: 'Fields/DateRange',
  component: DateRange,
}

const defaultProps = {
  start: '01/01/01',
  end: '02/02/02',
}

export const Default = bind(DateRange, {
  ...defaultProps,
})

export const DefaultStart = bind(DateRange, {
  ...defaultProps,
  end: undefined,
})

export const DefaultEnd = bind(DateRange, {
  ...defaultProps,
  start: undefined,
})

export const DefaultSame = bind(DateRange, {
  ...defaultProps,
  end: defaultProps.start,
})
