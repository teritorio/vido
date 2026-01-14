<script lang="ts" setup>
import type GeoJSON from 'geojson'

import Fields from '~/components/PoisCard/Fields.vue'
import type { FieldsListItem } from '~/types/api/field'
import type { PoiUnion } from '~/types/local/poi-deps'
import type { MapPoiDescription } from '~/lib/mapPois'

const properties: PoiUnion['properties'] = {
  metadata: {
    id: 1,
  },
  display: {
    color_fill: '#123456',
    color_line: '#123456',
    color_text: '#FFFFFF' as const,
    icon: 'map-marker-alt',
  },
  editorial: {},
  vido_visible: true,
}

const defaultProps = {
  fields: [],
  properties,
  geom: {
    type: 'Point',
    coordinates: [0, 0],
  } as GeoJSON.Geometry,
}

const description = {
  'fr-FR': {
    html: false,
    is_shortened: false,
    value: 'Itinéraire très intéressant, d\'une part pour sa variété paysagère accentuée par la traversée fréquente de cours d\'eau et d\'autre part, par la qualité du patrimoine bâti : maisons traditionnelles landaises, église en garluche. \n\nDistance : 10,2 km - Durée : 4h45 - Animaux tenus en laisse  - Sentier pédestre et VTT \nFiche rando disponible dans le topoguide du Département des Landes du Pays de Born n°15 (en vente : 2 €)',
  },
} satisfies MapPoiDescription

const props = {
  DefaultEmpty: {
    ...defaultProps,
  },
  Many: {
    ...defaultProps,
    fields: [
      { field: 'phone', render: 'phone' } as FieldsListItem,
      { field: 'route', render: 'route' } as FieldsListItem,
      { field: 'short_description', render: 'text' } as FieldsListItem,
    ],
    properties: {
      ...properties,
      'phone': ['+33676544'],
      'mobile': ['+339750987766'],
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
    details: 'details',
  },
}
</script>

<template>
  <Story title="PoisCard/Fields">
    <Variant
      v-for="(p, name) in props"
      :key="name"
      :title="name.replace(/([A-Z])/g, ' $1').trim()"
    >
      <Fields v-bind="p" />
    </Variant>
  </Story>
</template>
