import Category from '~/components/Categories/Category.vue'
import { ApiMenuCategory } from '~/lib/apiMenu'
import { bind } from '~/lib/storybook-types'

export default {
  title: 'Categories/Category',
  component: Category,
}

const category: ApiMenuCategory = {
  id: 123,
  selected_by_default: false,
  parent_id: null,
  index_order: 1,
  menu_group: undefined,
  link: undefined,
  category: {
    name: { fr: 'Leisure' },
    icon: 'teritorio teritorio-bar',
    color_fill: '#284627',
    color_line: '#284627',
    style_class: [],
    style_merge: true,
    display_mode: 'large',
    zoom: 14,
    // filters
  },
}

const defaultProps = {
  category,
  filters: {},
  selected: false,
  size: 'lg',
}

export const Default = bind(Category, {
  ...defaultProps,
})

export const Selected = bind(Category, {
  ...defaultProps,
  selected: true,
})

export const DefaultCompact = bind(Category, {
  ...defaultProps,
  category: {
    ...defaultProps.category,
    category: {
      ...defaultProps.category.category,
      display_mode: 'compact',
    },
  },
})

export const SelectedCompact = bind(Category, {
  ...defaultProps,
  category: {
    ...defaultProps.category,
    category: {
      ...defaultProps.category.category,
      display_mode: 'compact',
    },
  },
  selected: true,
})

// export const Filter = bind(Category, {
//   ...defaultProps,
//   filters:
// })
