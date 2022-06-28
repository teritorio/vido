import maplibregl, {
  LayerSpecification,
  SymbolLayerSpecification,
  Map,
  Marker,
  LngLatBoundsLike,
  FitBoundsOptions,
} from 'maplibre-gl'

import TeritorioIconBadge from '@/components/UI/TeritorioIconBadge.vue'

import { ApiMenuCategory } from './apiMenu'
import { ApiPoi } from './apiPois'
import { getBBoxFeatures } from './bbox'
import { createMarkerDonutChart } from './clusters'

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

export function updateMarkers(
  map: Map,
  categories: Record<ApiMenuCategory['id'], ApiMenuCategory>,
  markers: { [id: string]: maplibregl.Marker },
  src: string,
  fitBounds: (bounds: LngLatBoundsLike, options: FitBoundsOptions) => void,
  markerClickCallBack: (feature: ApiPoi) => void
) {
  const markerIdPrevious = Object.keys(markers)
  const markerIdcurrent: string[] = []

  const features = map.querySourceFeatures(src)
  // for every cluster on the screen, create an HTML marker for it (if we didn't yet),
  // and add it to the map if it's not there already
  features
    .filter((feature) => feature.geometry.type === 'Point')
    .forEach((feature) => {
      const coords = (feature.geometry as GeoJSON.Point).coordinates as [
        number,
        number
      ]
      const props = feature.properties
      if (props?.cluster) {
        const id = 'c' + props.cluster_id
        markerIdcurrent.push(id)
        if (!markers[id]) {
          const el = createMarkerDonutChart(categories, props)
          el.classList.add('cluster-item')
          markers[id] = new Marker({
            element: el,
          }).setLngLat(coords)
          el.addEventListener('click', (e) => {
            e.stopPropagation()
            // if (!map) return
            const source = map.getSource(src)

            if (source && 'getClusterLeaves' in source) {
              // @ts-ignore
              source.getClusterLeaves(
                props.cluster_id,
                100,
                0,
                (error: any, features: GeoJSON.Feature[]) => {
                  if (!error && map) {
                    const bounds = getBBoxFeatures(features)
                    if (bounds) {
                      fitBounds(bounds, {})
                    }
                  }
                }
              )
            }
          })
          markers[id].addTo(map)
        }
      } else if (props?.metadata) {
        if (typeof props.metadata === 'string') {
          props.metadata = JSON.parse(props.metadata)
        }
        if (props?.metadata?.id) {
          const id = 'm' + props.metadata.id
          markerIdcurrent.push(id)
          if (!markers[id]) {
            // const markerCoords = this.featuresCoordinates[props.metadata.id]
            const markerCoords =
              feature.geometry.type === 'Point' &&
              (feature.geometry.coordinates as TupleLatLng)
            if (markerCoords && props.display) {
              if (typeof props.display === 'string') {
                props.display = JSON.parse(props.display)
              }
              // Marker
              markers[id] = makerHtmlFactory(
                markerCoords, // Using this to avoid misplaced marker
                props.display?.color_fill || '#ff0000',
                props.display?.icon || '#ff0000',
                props['image:thumbnail']
              )
              const el = markers[id].getElement()

              // Click handler
              if (typeof props.editorial === 'string') {
                props.editorial = JSON.parse(props.editorial)
              }
              if (props.editorial?.popup_properties) {
                el.addEventListener('click', (e: MouseEvent) => {
                  e.stopPropagation()
                  markerClickCallBack(feature as unknown as ApiPoi)
                })
              }
              markers[id].addTo(map)
            }
          }
        }
      }
    })

  // for every marker we've added previously, remove those that are no longer visible
  const markerIdcurrentSet = new Set(markerIdcurrent)
  markerIdPrevious.forEach((id) => {
    if (!markerIdcurrentSet.has(id)) {
      markers[id].remove()
      delete markers[id]
    }
  })

  return markers
}
