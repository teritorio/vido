import PoiCardFields from '~/components/PoisCard/PoiCardFields.vue'
import { ApiPoiProperties } from '~/lib/apiPois'
import { bind } from '~/lib/storybook-types'

export default {
  title: 'PoisCard/PoiCardFields',
  component: PoiCardFields,
}

const properties: ApiPoiProperties = {
  metadata: {
    id: 1,
  },
}

const defaultProps = {
  properties,
}

export const DefaultEmpty = bind(PoiCardFields, {
  ...defaultProps,
})

export const Phone = bind(PoiCardFields, {
  ...defaultProps,
  properties: {
    ...defaultProps.properties,
    editorial: {
      popup_properties: ['phone', 'mobile'],
    },
    phone: '+33676544',
    mobile: '+339750987766',
  },
})

export const Route = bind(PoiCardFields, {
  ...defaultProps,
  properties: {
    ...defaultProps.properties,
    editorial: {
      popup_properties: ['route:*'],
    },
    'route:hiking:difficulty': 'easy',
    'route:hiking:duration': 285,
    'route:hiking:length': 10.2,
    'route:mtb:difficulty': 'easy',
    'route:mtb:duration': 90,
    'route:mtb:length': 10.2,
    'route:gpx_trace': 'https://cdt40.tourinsoft.com/upload/15.8.gpx',
    'route:pdf': 'https://cdt40.tourinsoft.com/upload/ITIAQU040V502MFU.pdf',
  },
})

const description =
  "Itinéraire très intéressant, d'une part pour sa variété paysagère accentuée par la traversée fréquente de cours d'eau et d'autre part, par la qualité du patrimoine bâti : maisons traditionnelles landaises, église en garluche. \n\nDistance : 10,2 km - Durée : 4h45 - Animaux tenus en laisse  - Sentier pédestre et VTT \nFiche rando disponible dans le topoguide du Département des Landes du Pays de Born n°15 (en vente : 2 €)"

export const Description = bind(PoiCardFields, {
  ...defaultProps,
  properties: {
    ...defaultProps.properties,
    editorial: {
      popup_properties: ['description'],
    },
    description,
  },
})

export const DescriptionDetails = bind(PoiCardFields, {
  ...defaultProps,
  properties: {
    ...defaultProps.properties,
    editorial: {
      popup_properties: ['description'],
    },
    description,
  },
  details: true,
})
