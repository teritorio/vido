import FieldsGroup from '~/components/PoisDetails/FieldsGroup.vue'
import { bind } from '~/lib/storybook-types'

export default {
  title: 'PoisDetails/FieldsGroup',
  component: FieldsGroup,
}

const defaultProps = {
  group: {
    group: 'contact',
    display_mode: 'standard',
    icon: 'phone',
    fields: [{ field: 'name', render: 'string' }],
  },
  colorFill: '#f76Ffe',
  properties: {
    metadata: { id: 0 },
    name: 'foo',
  },
  geom: {
    type: 'Point',
    coordinates: [0, 0],
  },
}

export const Sandart = bind(FieldsGroup, {
  ...defaultProps,
})

export const Empty = bind(FieldsGroup, {
  ...defaultProps,
  properties: {
    metadata: { id: 0 },
  },
})

export const Label = bind(FieldsGroup, {
  ...defaultProps,
  group: {
    ...defaultProps.group,
    fields: [
      {
        label: true,
        field: 'name',
        render: 'string',
      },
    ],
  },
})

export const Card = bind(FieldsGroup, {
  ...defaultProps,
  group: {
    ...defaultProps.group,
    display_mode: 'card',
  },
})

const description = {
  'fr-FR': 'Itinéraire très intéressant, d\'une part pour sa variété paysagère accentuée par la traversée fréquente de cours d\'eau et d\'autre part, par la qualité du patrimoine bâti : maisons traditionnelles landaises, église en garluche. \n\nDistance : 10,2 km - Durée : 4h45 - Animaux tenus en laisse  - Sentier pédestre et VTT \nFiche rando disponible dans le topoguide du Département des Landes du Pays de Born n°15 (en vente : 2 €)',
}

export const Many = bind(FieldsGroup, {
  ...defaultProps,
  group: {
    ...defaultProps.group,
    fields: [
      { field: 'phone', render: 'phone' },
      { field: 'route', render: 'route' },
      { field: 'short_description', render: 'text' },
    ],
  },
  properties: {
    'metadata': { id: 0 },
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
  details: true,
})
