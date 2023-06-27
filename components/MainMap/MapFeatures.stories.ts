import type { LngLatBoundsLike } from 'maplibre-gl'

import MapFeatures from '~/components/MainMap/MapFeatures.vue'
import { ApiMenuCategory } from '~/lib/apiMenu'
import { ApiPoi } from '~/lib/apiPois'
import { bind, mapCss, parametersMap } from '~/lib/storybook-types'

export default {
  title: 'MainMap/MapFeatures',
  component: MapFeatures,
  parameters: {
    ...parametersMap,
  },
}

const defaultProps = {
  defaultBounds: [
    [-1.4755803, 43.4916681],
    [-1.4735674, 43.4902015],
  ] as LngLatBoundsLike,
  categories: [
    {
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
  ],
  explorerModeEnabled: false,
}

export const Default = bind(
  MapFeatures,
  {
    ...defaultProps,
  },
  { style: mapCss }
)

export const Small = bind(
  MapFeatures,
  {
    ...defaultProps,
    small: true,
  },
  { style: mapCss }
)

export const StyleIconFilter = bind(
  MapFeatures,
  {
    ...defaultProps,
    styleIconFilter: [['catering', 'catering_food', 'restaurant']],
  },
  { style: mapCss }
)

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
      popup_fields: [{ field: 'foot' }],
    },
  },
}

export const Features = bind(
  MapFeatures,
  {
    ...defaultProps,
    features: [feature1],
  },
  { style: mapCss }
)
