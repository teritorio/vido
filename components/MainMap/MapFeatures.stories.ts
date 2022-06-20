import MapFeatures from '@/components/MainMap/MapFeatures.vue'

import { ApiMenuCategory } from '~/lib/apiMenu'
import { ApiPoi } from '~/lib/apiPois'
import { bind } from '~/lib/storybook-types'

export default {
  title: 'MainMap/MapFeatures',
  component: MapFeatures,
}

const defaultProps = {
  defaultBounds: [
    [-1.4755803, 43.4916681],
    [-1.4735674, 43.4902015],
  ],
  categories: {
    0: {
      id: 1,
      parent_id: null,
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
    } as ApiMenuCategory,
  },
}

export const Default = bind(MapFeatures, {
  ...defaultProps,
})

export const Small = bind(MapFeatures, {
  ...defaultProps,
  small: true,
})

export const StyleIconFilter = bind(MapFeatures, {
  ...defaultProps,
  styleIconFilter: [['catering', 'catering_food', 'restaurant']],
})

const feature1: ApiPoi = {
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [-1.4745043, 43.4910071],
  },
  properties: {
    name: 'foo',
    metadata: {
      id: 1,
      category_ids: [1],
    },
    display: {
      icon: 'teritorio teritorio-catering-catering_food-restaurant',
      color_fill: '#ff0000',
      color_line: '#ff0000',
      style_class: ['catering', 'catering_food', 'restaurant'],
    },
    editorial: {
      popup_properties: ['foot'],
    },
  },
}

const feature2: ApiPoi = {
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [-1.4736125, 43.4909623],
  },
  properties: {
    name: 'foo',
    metadata: {
      id: 2,
      category_ids: [2],
    },
    display: {
      icon: 'teritorio safety-care-pharmacy',
      color_fill: '#00ff00',
      color_line: '#00ff00',
      style_class: ['safety', 'care', 'pharmacy'],
    },
    editorial: {
      popup_properties: ['foot'],
    },
  },
}

export const Features = bind(MapFeatures, {
  ...defaultProps,
  features: [feature1],
})

export const FeaturesSelected = bind(MapFeatures, {
  ...defaultProps,
  features: [feature1, feature2],
  selectedFeature: feature2,
})
