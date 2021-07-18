import CategoryList from './CategoryList'

export default {
  title: 'Components/CategoryList',
  component: CategoryList,
}

const DefaultTemplate = (_, { args }) => ({
  components: { CategoryList },
  props: Object.keys(args),
  template: `
    <CategoryList class="w-96" v-bind="$props" v-on="$props" />`,
})

export const Default = DefaultTemplate.bind({})

Default.args = {
  categories: [
    {
      color: 'rebeccapurple',
      id: '123',
      label: 'Leisure',
      picto: 'leisure',
      selected: false,
    },
    {
      color: 'tomato',
      id: '456',
      label: 'Beach volleyball',
      picto: 'leisure-sport-beachvolleyball',
      selected: true,
    },
  ],
}
