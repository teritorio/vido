import CategoryList from '~/components/Categories/CategoryList/CategoryList.vue'
import { Category } from '~/lib/apiMenu'
import { bind } from '~/lib/storybook-types'

export default {
  title: 'Categories/CategoryList',
  component: CategoryList,
}

const categories: Category[] = [
  {
    id: 123,
    selected_by_default: false,
    parent_id: null,
    index_order: 1,
    menu_group: {
      name: { fr: 'Leisure' },
      icon: 'teritorio teritorio-bar',
      color_fill: '#284627',
      color_line: '#284627',
      display_mode: 'compact',
      vido_children: null,
    },
    link: undefined,
    category: undefined,
  },
  {
    id: 456,
    selected_by_default: true,
    parent_id: null,
    index_order: 2,
    menu_group: {
      name: { fr: 'Beach volleyball' },
      icon: 'teritorio teritorio-bar',
      color_fill: '#284627',
      color_line: '#284627',
      display_mode: 'large',
      vido_children: null,
    },
    link: undefined,
    category: undefined,
  },
]

const defaultProps = {
  categories,
  filters: {},
}

export const Default = bind(CategoryList, {
  ...defaultProps,
})