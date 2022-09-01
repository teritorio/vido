import MenuItemList from '~/components/Categories/MenuItemList.vue'
import { ApiMenuCategory, ApiMenuLink, MenuGroup } from '~/lib/apiMenu'
import { bind } from '~/lib/storybook-types'

export default {
  title: 'Categories/MenuItemList',
  component: MenuItemList,
}

const menuGroup: MenuGroup = {
  id: 1,
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

const menuLink: ApiMenuLink = {
  id: 2,
  selected_by_default: false,
  parent_id: null,
  index_order: 1,
  menu_group: undefined,
  link: {
    href: 'https://example.com',
    name: { fr: 'Example.com' },
    icon: 'teritorio teritorio-bar',
    color_fill: '#284627',
    color_line: '#284627',
    display_mode: 'compact',
  },
  category: undefined,
}

const category: ApiMenuCategory = {
  id: 3,
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
  menuItems: [menuGroup, menuLink, category],
  filters: {},
  categoriesActivesubsCount: {},
  isSubCategorySelected: () => false,
  size: 'lg',
}

export const Default = bind(MenuItemList, {
  ...defaultProps,
})

export const ManyGroups = bind(MenuItemList, {
  ...defaultProps,
  menuItems: [
    menuGroup,
    menuGroup,
    menuGroup,
    menuGroup,
    menuGroup,
    menuGroup,
    menuGroup,
    menuGroup,
    menuGroup,
  ],
})
