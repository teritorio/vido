import { AnyLayer } from 'maplibre-gl'

export const markerLayerFactory = (source: string, id: string): AnyLayer => ({
  id,
  type: 'symbol',
  source,
  filter: ['!=', 'cluster', true],
  paint: {
    'text-color': [
      'match',
      [
        'at',
        0,
        [
          'array',
          ['get', 'tourism_style_class', ['object', ['get', 'display']]],
        ],
      ],
      'products',
      '#F25C05',
      'convenience',
      '#00a0a4',
      'services',
      '#2a62ac',
      'safety',
      '#e42224',
      'mobility',
      '#3b74b9',
      'amenity',
      '#2a62ac',
      'remarkable',
      '#e50980',
      'culture',
      '#76009e',
      'hosting',
      '#99163a',
      'catering',
      '#f09007',
      'leisure',
      '#00A757',
      'public_landmark',
      '#1D1D1B',
      'shopping',
      '#808080',
      '#666',
    ],
    'text-halo-blur': 0.5,
    'text-halo-color': '#ffffff',
    'text-halo-width': 1,
    'text-opacity': ['interpolate', ['linear'], ['zoom'], 14, 0, 15, 1],
  },
  layout: {
    'text-anchor': 'top',
    'text-field': ['get', 'name'],
    'text-max-width': 9,
    'text-offset': [0, 1.3],
    'text-padding': 2,
    'text-size': 12,
    'text-optional': true,
    'text-allow-overlap': false,
  },
})
