<script lang="ts" setup>
import type { FontAwesomeIconProps } from '@fortawesome/vue-fontawesome'

import Link from '~/components/Menu/Link.vue'
import type { ApiMenuLink } from '~/types/api/menu'

const menuLink: ApiMenuLink = {
  id: 123,
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

const defaultProps = {
  menuLink,
  size: 'lg' as FontAwesomeIconProps['size'],
  displayModeDefault: 'large' as 'compact' | 'large',
}

const props = {
  Default: {
    ...defaultProps,
  },
  Large: {
    ...defaultProps,
    menuLink: {
      ...defaultProps.menuLink,
      link: {
        ...menuLink.link,
        display_mode: 'large' as 'compact' | 'large',
      },
    },
  },
}
</script>

<template>
  <Story title="Menu/Link">
    <Variant
      v-for="(p, name) in props"
      :key="name"
      :title="name.replace(/([A-Z])/g, ' $1').trim()"
    >
      <Link v-bind="p" />
    </Variant>
  </Story>
</template>
