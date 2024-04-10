<script lang="ts" setup>
import type { FontAwesomeIconProps } from '@fortawesome/vue-fontawesome'

import ItemList from '~/components/Menu/ItemList.vue'
import type { ApiMenuCategory, ApiMenuLink, MenuGroup } from '~/lib/apiMenu'

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
    display_mode: 'compact' as 'compact' | 'large',
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
    display_mode: 'compact' as 'compact' | 'large',
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
    display_mode: 'compact' as 'compact' | 'large',
    zoom: 14,
    // filters
  },
}

const defaultProps = {
  menuItems: [menuGroup, menuLink, category],
  filters: {},
  categoriesActivesCountByParent: {},
  selectedCategoriesIds: [],
  size: 'lg' as FontAwesomeIconProps['size'],
  displayModeDefault: 'large' as 'compact' | 'large',
}

const props = {
  Default: {
    ...defaultProps,
  },
  Large: {
    ...defaultProps,
    menuItems: [
      {
        ...defaultProps.menuItems[0],
        menu_group: {
          ...defaultProps.menuItems[0].menu_group,
          display_mode: 'large' as 'compact' | 'large',
        },
      } as MenuGroup,
      {
        ...defaultProps.menuItems[1],
        link: {
          ...defaultProps.menuItems[1].link,
          display_mode: 'large' as 'compact' | 'large',
        },
      } as ApiMenuLink,
      {
        ...defaultProps.menuItems[2],
        category: {
          ...defaultProps.menuItems[2].category,
          display_mode: 'large' as 'compact' | 'large',
        },
      } as ApiMenuCategory,
    ],
  },
  ManyGroups: {
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
  },
}
</script>

<template>
  <Story title="Menu/ItemList">
    <Variant
      v-for="(p, name) in props"
      :key="name"
      :title="name.replace(/([A-Z])/g, ' $1').trim()"
    >
      <ItemList v-bind="p" />
    </Variant>
  </Story>
</template>
