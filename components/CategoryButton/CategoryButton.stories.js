import CategoryButton from './CategoryButton'

export default {
  title: 'Components/CategoryButton',
  component: CategoryButton,
}

const DefaultTemplate = (_, { args }) => ({
  components: { CategoryButton },
  props: Object.keys(args),
  template: `
    <CategoryButton v-bind="$props" v-on="$props" />`,
})

export const Default = DefaultTemplate.bind({})

Default.args = {
  color: 'rebeccapurple',
  id: '123',
  label: 'Leisure',
  picto: 'leisure',
  selected: false,
}

export const Selected = DefaultTemplate.bind({})

Selected.args = {
  color: 'rebeccapurple',
  id: '123',
  label: 'Leisure',
  picto: 'leisure',
  selected: true,
}
