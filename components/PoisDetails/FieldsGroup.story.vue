<template>
  <Story title="PoisDetails/FieldsGroup">
    <Variant
      v-for="(p, name) in props"
      :key="name"
      :title="name.replace(/([A-Z])/g, ' $1').trim()"
    >
      <FieldsGroup v-bind="p" />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import GeoJSON from 'geojson'

import FieldsGroup from '~/components/PoisDetails/FieldsGroup.vue'

const defaultProps = {
  group: {
    group: '',
    display_mode: 'standard' as 'standard' | 'card',
    icon: '',
    fields: [
      {
        group: 'contact',
        display_mode: 'standard' as 'standard' | 'card',
        icon: 'phone',
        fields: [{ field: 'name' }],
      },
    ],
  },
  colorFill: '#f76Ffe',
  properties: {
    metadata: { id: 0 },
    name: 'foo',
  },
  geom: {
    type: 'Point',
    coordinates: [0, 0],
  } as GeoJSON.Geometry,
}

const description =
  "Itinéraire très intéressant, d'une part pour sa variété paysagère accentuée par la traversée fréquente de cours d'eau et d'autre part, par la qualité du patrimoine bâti : maisons traditionnelles landaises, église en garluche. \n\nDistance : 10,2 km - Durée : 4h45 - Animaux tenus en laisse  - Sentier pédestre et VTT \nFiche rando disponible dans le topoguide du Département des Landes du Pays de Born n°15 (en vente : 2 €)"

const props = {
  Sandart: {
    ...defaultProps,
  },
  Empty: {
    ...defaultProps,
    properties: {
      metadata: { id: 0 },
    },
  },
  Label: {
    ...defaultProps,
    group: {
      ...defaultProps.group,
      fields: [
        {
          ...defaultProps.group.fields[0],
          fields: [
            {
              label: true,
              field: 'name',
            },
          ],
        },
      ],
    },
  },
  Card: {
    ...defaultProps,
    group: {
      ...defaultProps.group,
      fields: [
        {
          ...defaultProps.group.fields[0],
          display_mode: 'card' as 'standard' | 'card',
        },
      ],
    },
  },
  Many: {
    ...defaultProps,
    group: {
      ...defaultProps.group,
      fields: [
        {
          ...defaultProps.group.fields[0],
          fields: [
            { field: 'phone' },
            { field: 'route' },
            { field: 'short_description' },
          ],
        },
      ],
    },
    properties: {
      metadata: { id: 0 },
      phone: ['+33676544'],
      mobile: ['+339750987766'],
      'route:hiking:difficulty': 'easy',
      'route:hiking:duration': 285,
      'route:hiking:length': 10.2,
      'route:mtb:difficulty': 'easy',
      'route:mtb:duration': 90,
      'route:mtb:length': 10.2,
      'route:gpx_trace': 'https://cdt40.tourinsoft.com/upload/15.8.gpx',
      'route:pdf': 'https://cdt40.tourinsoft.com/upload/ITIAQU040V502MFU.pdf',
      description,
    },
    details: true,
  },
}
</script>
