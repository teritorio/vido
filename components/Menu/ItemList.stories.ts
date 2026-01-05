import ItemList from '~/components/Menu/ItemList.vue'
import type { ApiMenuCategory, ApiMenuLink, MenuGroup } from '~/types/api/menu'
import { bind } from '~/lib/storybook-types'

export default {
  title: 'Menu/ItemList',
  component: ItemList,
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
    display_mode: 'compact',
    zoom: 14,
    // filters
  },
}

const defaultProps = {
  menuItems: [menuGroup, menuLink, category],
  filters: {},
  categoriesActivesCountByParent: {},
  selectedCategoriesIds: [],
  size: 'lg',
  displayModeDefault: 'large',
}

export const Default = bind(ItemList, {
  ...defaultProps,
})

export const Large = bind(ItemList, {
  ...defaultProps,
  menuItems: [
    {
      ...defaultProps.menuItems[0],
      menu_group: {
        ...defaultProps.menuItems[0].menu_group,
        display_mode: 'large',
      },
    },
    {
      ...defaultProps.menuItems[1],
      link: {
        ...defaultProps.menuItems[1].link,
        display_mode: 'large',
      },
    },
    {
      ...defaultProps.menuItems[2],
      category: {
        ...defaultProps.menuItems[2].category,
        display_mode: 'large',
      },
    },
  ],
})

export const ManyGroups = bind(ItemList, {
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
