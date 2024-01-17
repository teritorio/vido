import Group from '~/components/Menu/Group.vue'
import type { MenuGroup } from '~/lib/apiMenu'
import { bind } from '~/lib/storybook-types'

export default {
  title: 'Menu/Group',
  component: Group,
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
  categoriesActivesCount: 0,
  size: 'lg',
  displayModeDefault: 'large',
}

export const Default = bind(Group, {
  ...defaultProps,
})

export const Large = bind(Group, {
  ...defaultProps,
  menuGroup: {
    ...defaultProps.menuGroup,
    menu_group: {
      ...defaultProps.menuGroup.menu_group,
      display_mode: 'large',
    },
  },
})

export const Activities = bind(Group, {
  ...defaultProps,
  categoriesActivesCount: 33,
})

export const ActivitiesLarge = bind(Group, {
  ...defaultProps,
  menuGroup: {
    ...defaultProps.menuGroup,
    menu_group: {
      ...defaultProps.menuGroup.menu_group,
      display_mode: 'large',
    },
  },
  categoriesActivesCount: 33,
})

export const EdgeCases = bind(Group, {
  ...defaultProps,
  menuGroup: {
    ...defaultProps.menuGroup,
    menu_group: {
      ...defaultProps.menuGroup.menu_group,
      name: { fr: 'Leisure & Skiing and misc Ananas' },
      display_mode: 'large',
    },
  },
  categoriesActivesCount: 97647,
})
