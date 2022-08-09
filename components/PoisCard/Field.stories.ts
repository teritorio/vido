import Field from '~/components/PoisCard/Field.vue'
import { bind } from '~/lib/storybook-types'

export default {
  title: 'PoisCard/Field',
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

export const Addr = bind(Field, {
  ...defaultProps,
  field: { field: 'addr' },
  properties: {
    'addr:housenumber': '33',
    'addr:street': 'Rue du Nord',
    'addr:postcode': 35677,
    'addr:city': 'Le Grand Nord',
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

export const Phone = bind(Field, {
  ...defaultProps,
  field: { field: 'phone' },
  properties: {
    phone: ['+33676544'],
  },
})

export const Website = bind(Field, {
  ...defaultProps,
  field: { field: 'website' },
  properties: {
    website: ['https://example.com'],
  },
})

// export const OpeningHours = bind(Field, {
//   ...defaultProps,
//   field: { field: 'opening_hours' },
//   properties: {
//     'opening_hours': 'Mo-Fr 08:00-12:00,13:00-17:30; Sa',
//   },
// })

const description =
  "Itinéraire très intéressant, d'une part pour sa variété paysagère accentuée par la traversée fréquente de cours d'eau et d'autre part, par la qualité du patrimoine bâti : maisons traditionnelles landaises, église en garluche. \n\nDistance : 10,2 km - Durée : 4h45 - Animaux tenus en laisse  - Sentier pédestre et VTT \nFiche rando disponible dans le topoguide du Département des Landes du Pays de Born n°15 (en vente : 2 €)"

export const Description = bind(Field, {
  ...defaultProps,
  field: { field: 'description' },
  properties: {
    description,
  },
})

export const DescriptionDetails = bind(Field, {
  ...defaultProps,
  field: { field: 'description' },
  properties: {
    description,
  },
  details: true,
})
