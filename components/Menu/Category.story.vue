<template>
  <Story title="Menu/Category">
    <Variant
      v-for="(p, name) in props"
      :key="name"
      :title="name.replace(/([A-Z])/g, ' $1').trim()"
    >
      <Category v-bind="p" />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { FontAwesomeIconProps } from '@fortawesome/vue-fontawesome'

import Category from '~/components/Menu/Category.vue'
import { ApiMenuCategory } from '~/lib/apiMenu'

const category: ApiMenuCategory = {
  id: 123,
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
    display_mode: 'large' as 'compact' | 'large',
    zoom: 14,
    // filters
  },
}

const defaultProps = {
  category,
  filters: [],
  selected: false,
  size: 'lg' as FontAwesomeIconProps['size'],
  displayModeDefault: 'large' as 'compact' | 'large',
}

const props = {
  Default: {
    ...defaultProps,
  },
  Selected: {
    ...defaultProps,
    selected: true,
  },
  DefaultCompact: {
    ...defaultProps,
    category: {
      ...defaultProps.category,
      category: {
        ...defaultProps.category.category,
        display_mode: 'compact' as 'compact' | 'large',
      },
    },
  },
  SelectedCompact: {
    ...defaultProps,
    category: {
      ...defaultProps.category,
      category: {
        ...defaultProps.category.category,
        display_mode: 'compact' as 'compact' | 'large',
      },
    },
    selected: true,
  },
  // Filter: {
  //   ...defaultProps,
  //   filters:
  // },
}
</script>
