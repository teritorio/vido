import CategoryList from '~/components/Categories/CategoryList/CategoryList.vue'
import { bind } from '~/lib/storybook-types'

export default {
  title: 'Categories/CategoryList',
  component: CategoryList,
}

const defaultProps = {
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
  filters: {},
}

export const Default = bind(CategoryList, {
  ...defaultProps,
})
