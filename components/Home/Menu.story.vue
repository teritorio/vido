<template>
  <Story title="Home/Menu">
    <Variant
      v-for="(p, name) in props"
      :key="name"
      :title="name.replace(/([A-Z])/g, ' $1').trim()"
    >
      <MenuMock v-bind="p" />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { defineNuxtComponent } from '#app'
import Menu from '~/components/Home/Menu.vue'
import {
  ApiMenuCategory,
  ApiMenuLink,
  MenuGroup,
  MenuItem,
} from '~/lib/apiMenu'

const search: MenuGroup = {
  id: 1,
  selected_by_default: false,
  parent_id: null,
  index_order: 1,
  menu_group: {
    name: { fr: 'Search' },
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

const menuGroup1: MenuGroup = {
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

const menuGroup2: MenuGroup = {
  id: 12,
  selected_by_default: false,
  parent_id: 1,
  index_order: 1,
  menu_group: {
    name: { fr: 'Leisure & Skiing' },
    icon: 'teritorio teritorio-hosting',
    color_fill: '#284627',
    color_line: '#284627',
    // style_class
    display_mode: 'large',
    vido_children: [],
  },
  link: undefined,
  category: undefined,
}

const menuLink: ApiMenuLink = {
  id: 121,
  selected_by_default: false,
  parent_id: 12,
  index_order: 1,
  menu_group: undefined,
  link: {
    href: 'https://example.com',
    name: { fr: 'Example.com' },
    icon: 'teritorio teritorio-bar',
    color_fill: '#284627',
    color_line: '#284627',
    display_mode: 'large',
  },
  category: undefined,
}

const category: ApiMenuCategory = {
  id: 122,
  selected_by_default: false,
  parent_id: 12,
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
  logoUrl: '',
  mainUrl: '',
  siteName: '',
  filters: {},
  isCategorySelected: () => false,
  categoriesActivesCountByParent: {},
  menuBlock: 'MenuBlock' as 'MenuBlock' | 'MenuBlockBottom',
}

const MenuMock = defineNuxtComponent({
  extends: Menu,

  computed: {
    menuItems(): Record<ApiMenuCategory['id'], MenuItem> {
      return Object.fromEntries(
        [search, menuGroup1, menuGroup2, menuLink, category].map((i) => [
          i.id,
          i,
        ])
      )
    },
  },
})

const props = {
  Default: {
    ...defaultProps,
  },
}
</script>
