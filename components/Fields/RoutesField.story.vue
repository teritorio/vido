<template>
  <Story title="Fields/Route">
    <Variant
      v-for="(p, name) in props"
      :key="name"
      :title="name.replace(/([A-Z])/g, ' $1').trim()"
    >
      <RoutesField v-bind="p" />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import GeoJSON from 'geojson'

import RoutesField from '~/components/Fields/RoutesField.vue'
import { PropertyTranslationsContextEnum } from '~/plugins/property-translations'

const defaultProps = {
  context: PropertyTranslationsContextEnum.Details,
  properties: {
    metadata: { id: 0 },
    'route:hiking:difficulty': 'easy',
    'route:hiking:duration': 285,
    'route:hiking:length': 10.2,
    'route:mtb:difficulty': 'easy',
    'route:mtb:duration': 90,
    'route:mtb:length': 10.2,
  },
}

const props = {
  Default: {
    ...defaultProps,
  },
  MissingFields: {
    ...defaultProps,
    field: { field: 'route:gpx_trace' },
    properties: {
      metadata: { id: 0 },
      'route:hiking:difficulty': 'easy',
    },
  },
  MissingDifficulty: {
    ...defaultProps,
    field: { field: 'route:gpx_trace' },
    properties: {
      metadata: { id: 0 },
      'route:hiking:duration': 285,
      'route:hiking:length': 10.2,
    },
  },
}
</script>
