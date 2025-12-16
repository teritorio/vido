<script lang="ts" setup>
import type GeoJSON from 'geojson'
import type { FieldsListItem } from '~/lib/apiPois'
import Field from '~/components/Fields/Field.vue'
import { PropertyTranslationsContextEnum } from '~/stores/site'

const defaultProps = {
  context: PropertyTranslationsContextEnum.Details,
  field: { field: 'name', render: 'string' } as FieldsListItem,
  properties: {
    metadata: { id: 0 },
    name: 'foo',
  },
  geom: {
    type: 'Point',
    coordinates: [0.123456789, 0.987654321],
  } as GeoJSON.Geometry,
}

const description
  = 'Itinéraire très intéressant, d\'une part pour sa variété paysagère accentuée par la traversée fréquente de cours d\'eau et d\'autre part, par la qualité du patrimoine bâti : maisons traditionnelles landaises, église en garluche. \n\nDistance : 10,2 km - Durée : 4h45 - Animaux tenus en laisse  - Sentier pédestre et VTT \nFiche rando disponible dans le topoguide du Département des Landes du Pays de Born n°15 (en vente : 2 €)'

const props = {
  Default: {
    ...defaultProps,
  },
  DefaultListOne: {
    ...defaultProps,
    field: { field: 'email', render: 'email' } as FieldsListItem,
    properties: {
      metadata: { id: 0 },
      email: ['foo'],
    },
  },
  DefaultListMany: {
    ...defaultProps,
    field: { field: 'email', render: 'email' } as FieldsListItem,
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
  StartEndDate: {
    ...defaultProps,
    field: { field: 'start_end_date', render: 'start_end_date' } as FieldsListItem,
    properties: {
      metadata: { id: 0 },
      start_date: '2001-01-01',
      end_date: '2012-12-12',
    },
  },
  Addr: {
    ...defaultProps,
    field: { field: 'addr', render: 'addr' } as FieldsListItem,
    properties: {
      'metadata': { id: 0 },
      'addr:housenumber': '33',
      'addr:street': 'Rue du Nord',
      'addr:postcode': '35677',
      'addr:city': 'Le Grand Nord',
    },
  },
  Description: {
    ...defaultProps,
    field: { field: 'description', render: 'html' } as FieldsListItem,
    properties: {
      metadata: { id: 0 },
      description,
    },
  },
  DescriptionShort: {
    ...defaultProps,
    field: { field: 'short_description', render: 'string@short' } as FieldsListItem,
    properties: {
      metadata: { id: 0 },
      description,
    },
  },
  DescriptionDetails: {
    ...defaultProps,
    field: { field: 'short_description', render: 'string@short' } as FieldsListItem,
    properties: {
      metadata: { id: 0 },
      description,
    },
    details: 'details',
  },
  Email: {
    ...defaultProps,
    field: { field: 'email', render: 'email' } as FieldsListItem,
    properties: {
      metadata: { id: 0 },
      email: ['root@example.com'],
    },
  },
  Website: {
    ...defaultProps,
    field: { field: 'website', render: 'weblink' } as FieldsListItem,
    properties: {
      metadata: { id: 0 },
      website: ['https://example.com'],
    },
  },
  Facebook: {
    ...defaultProps,
    field: { field: 'facebook', render: 'weblink@social-network' } as FieldsListItem,
    properties: {
      metadata: { id: 0 },
      facebook: 'https://www.facebook.com/',
    },
  },
  Instagram: {
    ...defaultProps,
    field: { field: 'instagram', render: 'weblink@social-network' } as FieldsListItem,
    properties: {
      metadata: { id: 0 },
      instagram: 'https://www.instagram.com/',
    },
  },
  RouteGpxTrace: {
    ...defaultProps,
    field: { field: 'route:gpx_trace', render: 'weblink@download' } as FieldsListItem,
    properties: {
      'metadata': { id: 0 },
      'route:gpx_trace': 'https://cdt40.tourinsoft.com/upload/15.8.gpx',
    },
  },
  RoutePdf: {
    ...defaultProps,
    field: { field: 'route:pdf', render: 'weblink@download' } as FieldsListItem,
    properties: {
      'metadata': { id: 0 },
      'route:pdf': 'https://cdt40.tourinsoft.com/upload/ITIAQU040V502MFU.pdf',
    },
  },
  Download: {
    ...defaultProps,
    field: { field: 'download', render: 'weblink@download' } as FieldsListItem,
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
    field: { field: 'coordinates', render: 'coordinates' } as FieldsListItem,
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
