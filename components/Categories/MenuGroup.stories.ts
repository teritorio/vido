import MenuGroupCompo from '~/components/Categories/MenuGroup.vue'
import { MenuGroup } from '~/lib/apiMenu'
import { bind } from '~/lib/storybook-types'

export default {
  title: 'Categories/MenuGroup',
  component: MenuGroupCompo,
}

const menuGroup: MenuGroup = {
  id: 123,
  selected_by_default: false,
  parent_id: null,
  index_order: 1,
  menu_group: {
    name: { fr: 'Leisure & Skiing' },
    icon: 'teritorio teritorio-hosting',
    color_fill: '#284627',
    color_line: '#284627',
    // style_class
    display_mode: 'compact',
    vido_children: [],
  },
  link: undefined,
  category: undefined,
}

const defaultProps = {
  menuGroup,
  activeSubCategories: 0,
  size: 'lg',
}

export const Default = bind(MenuGroupCompo, {
  ...defaultProps,
})

export const Large = bind(MenuGroupCompo, {
  ...defaultProps,
  menuGroup: {
    ...defaultProps.menuGroup,
    menu_group: {
      ...defaultProps.menuGroup.menu_group,
      display_mode: 'large',
    },
  },
})

export const Activities = bind(MenuGroupCompo, {
  ...defaultProps,
  activeSubCategories: 33,
})

export const ActivitiesLarge = bind(MenuGroupCompo, {
  ...defaultProps,
  menuGroup: {
    ...defaultProps.menuGroup,
    menu_group: {
      ...defaultProps.menuGroup.menu_group,
      display_mode: 'large',
    },
  },
  activeSubCategories: 33,
})

export const EdgeCases = bind(MenuGroupCompo, {
  ...defaultProps,
  menuGroup: {
    ...defaultProps.menuGroup,
    menu_group: {
      ...defaultProps.menuGroup.menu_group,
      name: { fr: 'Leisure & Skiing and misc Ananas' },
      display_mode: 'large',
    },
  },
  activeSubCategories: 97647,
})
