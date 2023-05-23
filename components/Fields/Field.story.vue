<template>
  <Story title="Fields/Field">
    <Variant
      v-for="(p, name) in props"
      :key="name"
      :title="name.replace(/([A-Z])/g, ' $1').trim()"
    >
      <Field v-bind="p" />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import GeoJSON from 'geojson'

import Field from '~/components/Fields/Field.vue'
import { PropertyTranslationsContextEnum } from '~/plugins/property-translations'

const defaultProps = {
  context: PropertyTranslationsContextEnum.Details,
  field: { field: 'name' },
  properties: {
    metadata: { id: 0 },
    name: 'foo',
  },
  geom: {
    type: 'Point',
    coordinates: [0.123456789, 0.987654321],
  } as GeoJSON.Geometry,
}

const description =
  "Itinéraire très intéressant, d'une part pour sa variété paysagère accentuée par la traversée fréquente de cours d'eau et d'autre part, par la qualité du patrimoine bâti : maisons traditionnelles landaises, église en garluche. \n\nDistance : 10,2 km - Durée : 4h45 - Animaux tenus en laisse  - Sentier pédestre et VTT \nFiche rando disponible dans le topoguide du Département des Landes du Pays de Born n°15 (en vente : 2 €)"

const props = {
  Default: {
    ...defaultProps,
  },
  DefaultListOne: {
    ...defaultProps,
    field: { field: 'email' },
    properties: {
      metadata: { id: 0 },
      email: ['foo'],
    },
  },
  DefaultListMany: {
    ...defaultProps,
    field: { field: 'email' },
    properties: {
      metadata: { id: 0 },
      email: ['foo', 'bar'],
    },
  },
  NoValue: {
    ...defaultProps,
    properties: {
      metadata: { id: 0 },
    },
  },
  Label: {
    ...defaultProps,
    field: {
      ...defaultProps.field,
      label: true,
    },
  },
  Route: {
    ...defaultProps,
    field: { field: 'route' },
    properties: {
      metadata: { id: 0 },
      'route:hiking:difficulty': 'easy',
      'route:hiking:duration': 285,
      'route:hiking:length': 10.2,
      'route:mtb:difficulty': 'easy',
      'route:mtb:duration': 90,
      'route:mtb:length': 10.2,
    },
  },
  StartEndDate: {
    ...defaultProps,
    field: { field: 'start_end_date' },
    properties: {
      metadata: { id: 0 },
      start_date: '2001-01-01',
      end_date: '2012-12-12',
    },
  },
  Addr: {
    ...defaultProps,
    field: { field: 'addr' },
    properties: {
      metadata: { id: 0 },
      'addr:housenumber': '33',
      'addr:street': 'Rue du Nord',
      'addr:postcode': '35677',
      'addr:city': 'Le Grand Nord',
    },
  },
  Description: {
    ...defaultProps,
    field: { field: 'description' },
    properties: {
      metadata: { id: 0 },
      description,
    },
  },
  DescriptionShort: {
    ...defaultProps,
    field: { field: 'short_description' },
    properties: {
      metadata: { id: 0 },
      description,
    },
  },
  DescriptionDetails: {
    ...defaultProps,
    field: { field: 'short_description' },
    properties: {
      metadata: { id: 0 },
      description,
    },
    details: 'details',
  },
  Phone: {
    ...defaultProps,
    field: { field: 'phone' },
    properties: {
      metadata: { id: 0 },
      phone: ['+33676544'],
    },
  },
  Email: {
    ...defaultProps,
    field: { field: 'email' },
    properties: {
      metadata: { id: 0 },
      email: ['root@example.com'],
    },
  },
  Website: {
    ...defaultProps,
    field: { field: 'website' },
    properties: {
      metadata: { id: 0 },
      website: ['https://example.com'],
    },
  },
  Facebook: {
    ...defaultProps,
    field: { field: 'facebook' },
    properties: {
      metadata: { id: 0 },
      facebook: 'https://www.facebook.com/',
    },
  },
  Instagram: {
    ...defaultProps,
    field: { field: 'instagram' },
    properties: {
      metadata: { id: 0 },
      instagram: 'https://www.instagram.com/',
    },
  },
  RouteGpxTrace: {
    ...defaultProps,
    field: { field: 'route:gpx_trace' },
    properties: {
      metadata: { id: 0 },
      'route:gpx_trace': 'https://cdt40.tourinsoft.com/upload/15.8.gpx',
    },
  },
  RoutePdf: {
    ...defaultProps,
    field: { field: 'route:pdf' },
    properties: {
      metadata: { id: 0 },
      'route:pdf': 'https://cdt40.tourinsoft.com/upload/ITIAQU040V502MFU.pdf',
    },
  },
  Download: {
    ...defaultProps,
    field: { field: 'download' },
    properties: {
      metadata: { id: 0 },
      download: [
        'https://cdt40.tourinsoft.com/upload/ITIAQU040V502MFU.pdf',
        'https://cdt41.tourinsoft.com/upload/ITIAQU040V502MFU.pdf',
      ],
    },
  },
  Coordinates: {
    ...defaultProps,
    field: { field: 'coordinates' },
  },
}

// export const OpeningHours: {
//   ...defaultProps,
//   field: { field: 'opening_hours' },
//   properties: {
//     'opening_hours': 'Mo-Fr 08:00-12:00,13:00-17:30; Sa',
//   },
// })
</script>
