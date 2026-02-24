import Category from '~/components/Menu/Category.vue'
import type { ApiMenuCategory } from '~/types/api/menu'
import { bind } from '~/lib/storybook-types'

export default {
  title: 'Menu/Category',
  component: Category,
}

const category: ApiMenuCategory = {
  id: 123,
  selected_by_default: false,
  index_order: 1,
  category: {
    name: { fr: 'Leisure' },
    icon: 'teritorio teritorio-bar',
    color_fill: '#284627',
    color_line: '#284627',
    style_class: [],
    style_merge: true,
    display_mode: 'large',
    zoom: 14,
  },
}

const defaultProps = {
  category,
  filters: [],
  selected: false,
  size: 'lg',
  displayModeDefault: 'large',
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
