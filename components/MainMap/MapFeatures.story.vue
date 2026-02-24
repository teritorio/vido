<script lang="ts" setup>
import { LngLatBounds } from 'maplibre-gl'
import MapFeatures from '~/components/MainMap/MapFeatures.vue'
import type { MenuCategory } from '~/types/local/menu'
import type { Poi } from '~/types/local/poi'
import { mapCss } from '~/lib/storybook-types'

const defaultProps = {
  defaultBounds: new LngLatBounds([
    [-1.4755803, 43.4916681],
    [-1.4735674, 43.4902015],
  ]),
  categories: [
    {
      id: 1,
      index_order: 0,
      hidden: false,
      menu_group: undefined,
      link: undefined,
      selected_by_default: false,
      category: {
        name: { en: 'foo' },
        icon: '',
        color_fill: '#ff0000',
        color_line: '#ff0000',
        style_class: [],
        style_merge: true,
        display_mode: 'large',
        zoom: 1,
      },
    } as MenuCategory,
  ],
  features: [],
}

const feature1: Poi = {
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [-1.4745043, 43.4910071],
  },
  properties: {
    name: { 'fr-FR': 'foo' },
    metadata: {
      id: 1,
      category_ids: [1],
    },
    display: {
      icon: 'teritorio teritorio-catering-catering_food-restaurant',
      icon_show: true,
      color_fill: '#ff0000',
      color_line: '#ff0000',
      color_text: '#FFFFFF' as const,
      style_class: ['catering', 'catering_food', 'restaurant'],
    },
    editorial: {
      popup_fields: [{ field: 'foo', translationKey: 'foo', render: 'string' }],
    },
  },
}

const props = {
  Default: {
    ...defaultProps,
  },
  Small: {
    ...defaultProps,
    small: true,
  },
  StyleIconFilter: {
    ...defaultProps,
    styleIconFilter: [['catering', 'catering_food', 'restaurant']],
  },
  Features: {
    ...defaultProps,
    features: [feature1],
  },
}
</script>

<template>
  <Story title="MainMap/MapFeatures">
    <Variant
      v-for="(p, name) in props"
      :key="name"
      :title="name.replace(/([A-Z])/g, ' $1').trim()"
    >
      <MapFeatures :style="mapCss" v-bind="p" />
    </Variant>
  </Story>
</template>
