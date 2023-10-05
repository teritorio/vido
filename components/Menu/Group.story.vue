<template>
  <Story title="Menu/Group">
    <Variant
      v-for="(p, name) in props"
      :key="name"
      :title="name.replace(/([A-Z])/g, ' $1').trim()"
    >
      <Group v-bind="p" />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { FontAwesomeIconProps } from '@fortawesome/vue-fontawesome'

import Group from '~/components/Menu/Group.vue'
import { MenuGroup } from '~/lib/apiMenu'

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
    display_mode: 'compact' as 'compact' | 'large',
    vido_children: [],
  },
  link: undefined,
  category: undefined,
}

const defaultProps = {
  menuGroup,
  categoriesActivesCount: 0,
  size: 'lg' as FontAwesomeIconProps['size'],
  displayModeDefault: 'large' as 'compact' | 'large',
}

const props = {
  Default: {
    ...defaultProps,
  },
  Large: {
    ...defaultProps,
    menuGroup: {
      ...defaultProps.menuGroup,
      menu_group: {
        ...defaultProps.menuGroup.menu_group,
        display_mode: 'large' as 'compact' | 'large',
      },
    },
  },
  Activities: {
    ...defaultProps,
    categoriesActivesCount: 33,
  },
  ActivitiesLarge: {
    ...defaultProps,
    menuGroup: {
      ...defaultProps.menuGroup,
      menu_group: {
        ...defaultProps.menuGroup.menu_group,
        display_mode: 'large' as 'compact' | 'large',
      },
    },
    categoriesActivesCount: 33,
  },
  EdgeCases: {
    ...defaultProps,
    menuGroup: {
      ...defaultProps.menuGroup,
      menu_group: {
        ...defaultProps.menuGroup.menu_group,
        name: { fr: 'Leisure & Skiing and misc Ananas' },
        display_mode: 'large' as 'compact' | 'large',
      },
    },
    categoriesActivesCount: 97647,
  },
}
</script>
