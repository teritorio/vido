import FieldsGroup from '~/components/PoisDetails/FieldsGroup.vue'
import { bind } from '~/lib/storybook-types'

export default {
  title: 'PoisDetails/FieldsGroup',
  component: FieldsGroup,
}

const defaultProps = {
  group: {
    group: 'contact',
    display_mode: 'standard',
    icon: 'phone',
    fields: [{ field: 'name' }],
  },
  title: 'Contact info',
  colorFill: '#f76Ffe',
  properties: {
    name: 'foo',
  },
}

export const Sandart = bind(FieldsGroup, {
  ...defaultProps,
})

export const Card = bind(FieldsGroup, {
  ...defaultProps,
  group: {
    ...defaultProps.group,
    display_mode: 'card',
  },
})
