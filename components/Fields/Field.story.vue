<script lang="ts" setup>
import type GeoJSON from 'geojson'
import type { FieldsListItem } from '~/types/local/field'
import Field from '~/components/Fields/Field.vue'
import { PropertyTranslationsContextEnum } from '~/stores/site'
import type { MapPoiDescription } from '~/lib/mapPois'

const defaultProps = {
  context: PropertyTranslationsContextEnum.Details,
  field: { field: 'name', render: 'string' } as FieldsListItem,
  properties: {
    metadata: { id: 0 },
    name: {
      'fr-FR': 'foo',
    },
    display: {
      color_fill: '#123456',
      color_line: '#123456',
      color_text: '#FFFFFF' as const,
      icon: 'map-marker-alt',
      icon_show: true,
    },
    editorial: {},
    vido_visible: true,
  },
  geom: {
    type: 'Point',
    coordinates: [0.123456789, 0.987654321],
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
  Default: {
    ...defaultProps,
  },
  DefaultListOne: {
    ...defaultProps,
    field: { field: 'email', render: 'email' } as FieldsListItem,
    properties: {
      ...defaultProps.properties,
      email: ['foo'],
    },
  },
  DefaultListMany: {
    ...defaultProps,
    field: { field: 'email', render: 'email' } as FieldsListItem,
    properties: {
      ...defaultProps.properties,
      email: ['foo', 'bar'],
    },
  },
  NoValue: {
    ...defaultProps,
    properties: {
      ...defaultProps.properties,
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
      ...defaultProps.properties,
      start_date: '2001-01-01',
      end_date: '2012-12-12',
    },
  },
  Addr: {
    ...defaultProps,
    field: { field: 'addr', render: 'addr' } as FieldsListItem,
    properties: {
      ...defaultProps.properties,
      'addr:housenumber': '33',
      'addr:street': 'Rue du Nord',
      'addr:postcode': '35677',
      'addr:city': 'Le Grand Nord',
    },
  },
  Description: {
    ...defaultProps,
    field: { field: 'description', render: 'text' } as FieldsListItem,
    properties: {
      ...defaultProps.properties,
      description,
    },
  },
  DescriptionShort: {
    ...defaultProps,
    field: { field: 'description', render: 'text' } as FieldsListItem,
    properties: {
      ...defaultProps.properties,
      description,
    },
  },
  DescriptionDetails: {
    ...defaultProps,
    field: { field: 'description', render: 'text' } as FieldsListItem,
    properties: {
      ...defaultProps.properties,
      description,
    },
    details: 'details',
  },
  Email: {
    ...defaultProps,
    field: { field: 'email', render: 'email' } as FieldsListItem,
    properties: {
      ...defaultProps.properties,
      email: ['root@example.com'],
    },
  },
  Website: {
    ...defaultProps,
    field: { field: 'website', render: 'weblink' } as FieldsListItem,
    properties: {
      ...defaultProps.properties,
      website: ['https://example.com'],
    },
  },
  Facebook: {
    ...defaultProps,
    field: { field: 'facebook', render: 'weblink@social-network' } as FieldsListItem,
    properties: {
      ...defaultProps.properties,
      facebook: 'https://www.facebook.com/',
    },
  },
  Instagram: {
    ...defaultProps,
    field: { field: 'instagram', render: 'weblink@social-network' } as FieldsListItem,
    properties: {
      ...defaultProps.properties,
      instagram: 'https://www.instagram.com/',
    },
  },
  RouteGpxTrace: {
    ...defaultProps,
    field: { field: 'route:gpx_trace', render: 'weblink@download' } as FieldsListItem,
    properties: {
      ...defaultProps.properties,
      'route:gpx_trace': 'https://cdt40.tourinsoft.com/upload/15.8.gpx',
    },
  },
  RoutePdf: {
    ...defaultProps,
    field: { field: 'route:pdf', render: 'weblink@download' } as FieldsListItem,
    properties: {
      ...defaultProps.properties,
      'route:pdf': 'https://cdt40.tourinsoft.com/upload/ITIAQU040V502MFU.pdf',
    },
  },
  Download: {
    ...defaultProps,
    field: { field: 'download', render: 'weblink@download' } as FieldsListItem,
    properties: {
      ...defaultProps.properties,
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
