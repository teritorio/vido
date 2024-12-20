import type { LayerSpecification, SymbolLayerSpecification } from 'maplibre-gl'

export function markerLayerTextFactory(layerTemplate: LayerSpecification, id: string, source: string): LayerSpecification {
  if (layerTemplate.type !== 'symbol') {
    return layerTemplate
  }
  else {
    const textColor
      = layerTemplate?.paint
      && 'text-color' in layerTemplate?.paint
      && Array.isArray(layerTemplate.paint['text-color'])
      && layerTemplate.paint['text-color']

    if (textColor && textColor[0] === 'let') {
      const superclass = textColor.indexOf('superclass')
      if (superclass) {
        textColor[superclass + 1] = [
          'at',
          0,
          ['array', ['get', 'style_class', ['object', ['get', 'display']]]],
        ]
      }
    }

    const layer: SymbolLayerSpecification = {
      id,
      type: layerTemplate.type,
      source,
      filter: ['!=', 'cluster', true],
      layout: {
        ...layerTemplate.layout,
        'text-field': ['get', 'name'],
        'text-offset': [0, 1.3],
      },
      paint: {
        ...layerTemplate.paint,
        'text-color': [
          'case',
          [
            'all',
            ['has', 'display'],
            ['has', 'color_fill', ['get', 'display']],
          ],
          ['get', 'color_fill', ['get', 'display']],
          textColor || '#000000',
        ],
        'text-opacity': ['interpolate', ['linear'], ['zoom'], 14, 0, 15, 1],
      },
    }

    return layer
  }
}
