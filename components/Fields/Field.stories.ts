import type { Meta, StoryObj } from '@storybook/vue3'
import Field from './Field.vue'
import { PropertyTranslationsContextEnum } from '~/plugins/property-translations'

const meta = {
  component: Field,
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof Field>

const description = 'Itinéraire très intéressant, d\'une part pour sa variété paysagère accentuée par la traversée fréquente de cours d\'eau et d\'autre part, par la qualité du patrimoine bâti : maisons traditionnelles landaises, église en garluche. \n\nDistance : 10,2 km - Durée : 4h45 - Animaux tenus en laisse  - Sentier pédestre et VTT \nFiche rando disponible dans le topoguide du Département des Landes du Pays de Born n°15 (en vente : 2 €)'

export const Default = {
  args: {
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
  },
} satisfies Story

export const DefaultListOne = {
  args: {
    ...Default.args,
    field: { field: 'email' },
    properties: {
      metadata: { id: 0 },
      email: ['foo'],
    },
  },
} satisfies Story

export const DefaultListMany = {
  args: {
    ...Default.args,
    field: { field: 'email' },
    properties: {
      metadata: { id: 0 },
      email: ['foo', 'bar'],
    },
  },
} satisfies Story

export const NoValue = {
  args: {
    ...Default.args,
    properties: {
      metadata: { id: 0 },
    },
  },
} satisfies Story

export const Label = {
  args: {
    ...Default.args,
    field: {
      ...Default.args.field,
      label: true,
    },
  },
} satisfies Story

export const Route = {
  args: {
    ...Default.args,
    field: { field: 'route' },
    properties: {
      'metadata': { id: 0 },
      'route:hiking:difficulty': 'easy',
      'route:hiking:duration': 285,
      'route:hiking:length': 10.2,
      'route:mtb:difficulty': 'easy',
      'route:mtb:duration': 90,
      'route:mtb:length': 10.2,
    },
  },
} satisfies Story

export const StartEndDate = {
  args: {
    ...Default.args,
    field: { field: 'start_end_date' },
    properties: {
      metadata: { id: 0 },
      start_date: '2001-01-01',
      end_date: '2012-12-12',
    },
  },
} satisfies Story

export const Addr = {
  args: {
    ...Default.args,
    field: { field: 'addr' },
    properties: {
      'metadata': { id: 0 },
      'addr:housenumber': '33',
      'addr:street': 'Rue du Nord',
      'addr:postcode': '35677',
      'addr:city': 'Le Grand Nord',
    },
  },
} satisfies Story

export const Description = {
  args: {
    ...Default.args,
    field: { field: 'description' },
    properties: {
      metadata: { id: 0 },
      description,
    },
  },
} satisfies Story

export const DescriptionShort = {
  args: {
    ...Default.args,
    field: { field: 'short_description' },
    properties: {
      metadata: { id: 0 },
      description,
    },
  },
} satisfies Story

export const DescriptionDetails = {
  args: {
    ...Default.args,
    field: { field: 'short_description' },
    properties: {
      metadata: { id: 0 },
      description,
    },
  },
} satisfies Story

export const Phone = {
  args: {
    ...Default.args,
    field: { field: 'phone' },
    properties: {
      metadata: { id: 0 },
      phone: ['+33676544'],
    },
  },
} satisfies Story

export const Email = {
  args: {
    ...Default.args,
    field: { field: 'email' },
    properties: {
      metadata: { id: 0 },
      email: ['root@example.com'],
    },
  },
} satisfies Story

export const Website = {
  args: {
    ...Default.args,
    field: { field: 'website' },
    properties: {
      metadata: { id: 0 },
      website: ['https://example.com'],
    },
  },
} satisfies Story

export const Facebook = {
  args: {
    ...Default.args,
    field: { field: 'facebook' },
    properties: {
      metadata: { id: 0 },
      facebook: 'https://www.facebook.com/',
    },
  },
} satisfies Story

export const Instagram = {
  args: {
    ...Default.args,
    field: { field: 'instagram' },
    properties: {
      metadata: { id: 0 },
      instagram: 'https://www.instagram.com/',
    },
  },
} satisfies Story

export const RouteGpxTrace = {
  args: {
    ...Default.args,
    field: { field: 'route:gpx_trace' },
    properties: {
      'metadata': { id: 0 },
      'route:gpx_trace': 'https://cdt40.tourinsoft.com/upload/15.8.gpx',
    },
  },
} satisfies Story

export const RoutePdf = {
  args: {
    ...Default.args,
    field: { field: 'route:pdf' },
    properties: {
      'metadata': { id: 0 },
      'route:pdf': 'https://cdt40.tourinsoft.com/upload/ITIAQU040V502MFU.pdf',
    },
  },
} satisfies Story

export const Download = {
  args: {
    ...Default.args,
    field: { field: 'download' },
    properties: {
      metadata: { id: 0 },
      download: [
        'https://cdt40.tourinsoft.com/upload/ITIAQU040V502MFU.pdf',
        'https://cdt41.tourinsoft.com/upload/ITIAQU040V502MFU.pdf',
      ],
    },
  },
} satisfies Story

export const Coordinates = {
  args: {
    ...Default.args,
    field: { field: 'coordinates' },
  },
} satisfies Story
