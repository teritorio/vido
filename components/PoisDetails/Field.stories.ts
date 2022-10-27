import Field from '~/components/PoisDetails/Field.vue'
import { bind } from '~/lib/storybook-types'

export default {
  title: 'PoisDetails/Field',
  component: Field,
}

const defaultProps = {
  field: { field: 'name' },
  properties: {
    name: 'foo',
  },
}

export const Default = bind(Field, {
  ...defaultProps,
})

export const NoValue = bind(Field, {
  ...defaultProps,
  properties: {},
})

export const Label = bind(Field, {
  ...defaultProps,
  field: {
    ...defaultProps.field,
    label: true,
  },
})

export const Route = bind(Field, {
  ...defaultProps,
  field: { field: 'route' },
  properties: {
    'route:hiking:difficulty': 'easy',
    'route:hiking:duration': 285,
    'route:hiking:length': 10.2,
    'route:mtb:difficulty': 'easy',
    'route:mtb:duration': 90,
    'route:mtb:length': 10.2,
  },
})

export const StartEndDate = bind(Field, {
  ...defaultProps,
  field: { field: 'start_end_date' },
  properties: {
    start_date: '2001-01-01',
    end_date: '2012-12-12',
  },
})

const description =
  "Itinéraire très intéressant, d'une part pour sa variété paysagère accentuée par la traversée fréquente de cours d'eau et d'autre part, par la qualité du patrimoine bâti : maisons traditionnelles landaises, église en garluche. \n\nDistance : 10,2 km - Durée : 4h45 - Animaux tenus en laisse  - Sentier pédestre et VTT \nFiche rando disponible dans le topoguide du Département des Landes du Pays de Born n°15 (en vente : 2 €)"

export const Description = bind(Field, {
  ...defaultProps,
  field: { field: 'description' },
  properties: {
    description,
  },
})

export const Phone = bind(Field, {
  ...defaultProps,
  field: { field: 'phone' },
  properties: {
    phone: ['+33676544'],
  },
})

export const Email = bind(Field, {
  ...defaultProps,
  field: { field: 'email' },
  properties: {
    email: ['root@example.com'],
  },
})

export const Website = bind(Field, {
  ...defaultProps,
  field: { field: 'website' },
  properties: {
    website: ['https://example.com'],
  },
})

export const Facebook = bind(Field, {
  ...defaultProps,
  field: { field: 'facebook' },
  properties: {
    facebook: 'https://www.facebook.com/',
  },
})

export const RouteGpxTrace = bind(Field, {
  ...defaultProps,
  field: { field: 'route:gpx_trace' },
  properties: {
    'route:gpx_trace': 'https://cdt40.tourinsoft.com/upload/15.8.gpx',
  },
})

export const RoutePdf = bind(Field, {
  ...defaultProps,
  field: { field: 'route:pdf' },
  properties: {
    'route:pdf': 'https://cdt40.tourinsoft.com/upload/ITIAQU040V502MFU.pdf',
  },
})

// export const OpeningHours = bind(Field, {
//   ...defaultProps,
//   field: { field: 'opening_hours' },
//   properties: {
//     'opening_hours': 'Mo-Fr 08:00-12:00,13:00-17:30; Sa',
//   },
// })
