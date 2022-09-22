import Fields from '~/components/PoisDetails/Fields.vue'
import { ApiPoiProperties } from '~/lib/apiPois'
import { bind } from '~/lib/storybook-types'

export default {
  title: 'PoisDetails/Fields',
  component: Fields,
}

const properties: ApiPoiProperties = {
  metadata: {
    id: 1,
  },
}

const defaultProps = {
  properties,
}

export const DefaultEmpty = bind(Fields, {
  ...defaultProps,
})

const description =
  "Itinéraire très intéressant, d'une part pour sa variété paysagère accentuée par la traversée fréquente de cours d'eau et d'autre part, par la qualité du patrimoine bâti : maisons traditionnelles landaises, église en garluche. \n\nDistance : 10,2 km - Durée : 4h45 - Animaux tenus en laisse  - Sentier pédestre et VTT \nFiche rando disponible dans le topoguide du Département des Landes du Pays de Born n°15 (en vente : 2 €)"

export const Many = bind(Fields, {
  ...defaultProps,
  fields: [{ field: 'phone' }, { field: 'route' }, { field: 'description' }],
  properties: {
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
})
