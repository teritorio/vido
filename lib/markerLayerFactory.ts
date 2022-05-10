import maplibregl, {
  LayerSpecification,
  SymbolLayerSpecification,
} from 'maplibre-gl'

import TeritorioIconBadge from '@/components/TeritorioIcon/TeritorioIconBadge.vue'

import { TupleLatLng } from '~/utils/types'

export const markerLayerTextFactory = (
  layerTemplate: LayerSpecification,
  id: string,
  source: string
): LayerSpecification => {
  if (layerTemplate.type !== 'symbol') {
    return layerTemplate
  } else {
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
        'text-opacity': ['interpolate', ['linear'], ['zoom'], 14, 0, 15, 1],
      },
    }

    if (
      layer?.paint &&
      'text-color' in layer?.paint &&
      Array.isArray(layer.paint['text-color']) &&
      layer.paint['text-color'][0] === 'let'
    ) {
      const superclass = layer.paint['text-color'].indexOf('superclass')
      if (superclass) {
        layer.paint['text-color'][superclass + 1] = [
          'at',
          0,
          ['array', ['get', 'style_class', ['object', ['get', 'display']]]],
        ]
      }
    }

    return layer
  }
}

export function makerHtmlFactory(
  latLng: TupleLatLng,
  colorFill: string,
  icon: string,
  thumbnail: string | undefined,
  size: string | null = null
): maplibregl.Marker {
  // Marker
  const el: HTMLElement = document.createElement('div')
  el.classList.add('maplibregl-marker')
  el.classList.add('cluster-item')

  const marker = new maplibregl.Marker({
    element: el,
    ...(thumbnail && {
      offset: [0, -10],
    }),
  }).setLngLat(latLng) // Using this to avoid misplaced marker

  // Teritorio badge
  const instance = new TeritorioIconBadge({
    propsData: {
      colorFill,
      picto: icon,
      image: thumbnail,
      size,
    },
  }).$mount()
  el.appendChild(instance.$el)

  return marker
}
