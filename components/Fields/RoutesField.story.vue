<template>
  <Story title="Fields/Route">
    <div v-for="(p, name) in props" :key="name">
      <div
        v-for="id in [
          PropertyTranslationsContextEnum.Card,
          PropertyTranslationsContextEnum.Details,
        ]"
        :key="id"
      >
        <Variant :title="`${name.replace(/([A-Z])/g, ' $1').trim()} - ${id}`">
          <RoutesField v-bind="p" :context="id" />
        </Variant>
      </div>
    </div>
  </Story>
</template>

<script lang="ts" setup>
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
