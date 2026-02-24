<script lang="ts" setup>
import { defineNuxtComponent } from '#app'
import Menu from '~/components/Home/Menu.vue'
import type { ApiMenuLink } from '~/types/api/menu'
import type { MenuCategory, MenuGroup, MenuItem } from '~/types/local/menu'

const search: MenuGroup = {
  id: 1,
  selected_by_default: false,
  index_order: 1,
  menu_group: {
    name: { fr: 'Search' },
    icon: 'teritorio teritorio-hosting',
    color_fill: '#284627',
    color_line: '#284627',
    display_mode: 'compact',
    vido_children: [],
  },
}

const menuGroup1: MenuGroup = {
  id: 1,
  selected_by_default: false,
  index_order: 1,
  menu_group: {
    name: { fr: 'Leisure & Skiing' },
    icon: 'teritorio teritorio-hosting',
    color_fill: '#284627',
    color_line: '#284627',
    display_mode: 'compact',
    vido_children: [],
  },
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
    display_mode: 'large',
    vido_children: [],
  },
}

const menuLink: ApiMenuLink = {
  id: 121,
  selected_by_default: false,
  parent_id: 12,
  index_order: 1,
  link: {
    href: 'https://example.com',
    name: { fr: 'Example.com' },
    icon: 'teritorio teritorio-bar',
    color_fill: '#284627',
    color_line: '#284627',
    display_mode: 'large',
  },
}

const category: MenuCategory = {
  id: 122,
  selected_by_default: false,
  parent_id: 12,
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
    menuItems(): Record<MenuCategory['id'], MenuItem> {
      return Object.fromEntries(
        [search, menuGroup1, menuGroup2, menuLink, category].map(i => [
          i.id,
          i,
        ]),
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
