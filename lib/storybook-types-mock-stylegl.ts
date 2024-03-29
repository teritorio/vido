export default {
  version: 8,
  name: 'Empty Style',
  glyphs: 'https://vecto.teritorio.xyz/fonts/{fontstack}/{range}.pbf',
  sources: {
    openmaptiles: {
      type: 'vector',
      url: 'https://example.com/data/tiles.json',
    },
  },
  layers: [
    {
      id: 'bg',
      type: 'background',
      paint: {
        'background-color': 'rgba(251, 248, 211, 1)',
      },
    },
    {
      'id': 'poi-level-1',
      'type': 'symbol',
      'source': 'openmaptiles',
      'source-layer': 'poi_tourism',
      'minzoom': 12,
      'filter': [
        'all',
        ['<=', ['get', 'rank'], 14],
        ['<=', ['get', 'zoom'], ['zoom']],
        ['any', ['!', ['has', 'level']], ['==', ['get', 'level'], 0]],
        [
          'let',
          '_bloc_name',
          'styleFilter',
          ['let', 'style', ['get', 'style'], ['!=', ['var', 'style'], '•']],
        ],
      ],
      'layout': {
        'icon-image': [
          'concat',
          ['get', 'superclass'],
          ['case', ['has', 'class'], ['concat', '-', ['get', 'class']], ''],
          [
            'case',
            ['has', 'subclass'],
            ['concat', '-', ['get', 'subclass']],
            '',
          ],
          ['get', 'style'],
        ],
        'text-anchor': 'top',
        'text-field': '{name:latin}\n{name:nonlatin}',
        'text-font': ['Noto Sans Regular'],
        'text-max-width': 9,
        'text-offset': [0, 1],
        'text-padding': 2,
        'text-size': 12,
        'text-optional': true,
      },
      'paint': {
        'text-color': [
          'let',
          'style',
          ['get', 'style'],
          'superclass',
          ['get', 'superclass'],
          [
            'match',
            ['var', 'style'],
            '•',
            '#666',
            [
              'match',
              ['var', 'superclass'],
              'amenity',
              '#2a62ac',
              'catering',
              '#f09007',
              'culture',
              '#76009e',
              'hosting',
              '#99163a',
              'leisure',
              '#00a757',
              'local_shop',
              '#00a0c4',
              'mobility',
              '#3b74b9',
              'products',
              '#f25c05',
              'public_landmark',
              '#1d1d1b',
              'remarkable',
              '#e50980',
              'safety',
              '#e42224',
              'services',
              '#2a62ac',
              'shopping',
              '#808080',
              '#666',
            ],
          ],
        ],
        'text-halo-blur': 0.5,
        'text-halo-color': '#ffffff',
        'text-halo-width': 1,
      },
    },
  ],
  id: 'qtiiqwxez',
}
