import type {
  Map,
  LayerSpecification,
  SymbolLayerSpecification,
  LngLatBoundsLike,
  FitBoundsOptions,
} from 'maplibre-gl'
import { Marker } from 'maplibre-gl'
import { createApp } from 'vue'

import { ApiPoi } from './apiPois'
import { getBBoxFeatures } from './bbox'
import { createMarkerDonutChart } from './clusters'

import TeritorioIconBadge from '~/components/UI/TeritorioIconBadge.vue'
import { TupleLatLng } from '~/utils/types'

type ITMarker = InstanceType<typeof Marker>

export const markerLayerTextFactory = (
  layerTemplate: LayerSpecification,
  id: string,
  source: string
): LayerSpecification => {
  if (layerTemplate.type !== 'symbol') {
    return layerTemplate
  } else {
    const textColor =
      layerTemplate?.paint &&
      'text-color' in layerTemplate?.paint &&
      Array.isArray(layerTemplate.paint['text-color']) &&
      layerTemplate.paint['text-color']

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

export function makerHtmlFactory(
  id: string,
  latLng: TupleLatLng,
  colorFill: string,
  icon: string,
  thumbnail: string | undefined,
  size: string | null = null,
  text?: string
): ITMarker {
  // Marker
  const el: HTMLElement = document.createElement('div')
  el.id = id
  el.classList.add('maplibregl-marker')
  el.classList.add('cluster-item')

  const marker = new Marker({
    element: el,
    ...(thumbnail && {
      offset: [0, -10],
    }),
  }).setLngLat(latLng) // Using this to avoid misplaced marker

  // Teritorio badge
  createApp(TeritorioIconBadge, {
    colorFill,
    picto: icon,
    image: thumbnail,
    size,
    text: text,
  }).mount(el)

  return marker
}

export function updateMarkers(
  map: Map,
  markers: { [id: string]: ITMarker },
  src: string,
  fitBounds: (bounds: LngLatBoundsLike, options: FitBoundsOptions) => void,
  markerClickCallBack: ((feature: ApiPoi) => void) | undefined
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
          const {
            cluster: _a,
            cluster_id: _b,
            point_count: point_count,
            _c: _d,
            point_count_abbreviated: _e,
            ...countPercolor
          } = props
          const el = createMarkerDonutChart(countPercolor, point_count)
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
            if (markerCoords) {
              if (typeof props.display === 'string') {
                props.display = JSON.parse(props.display)
              }
              if (typeof props.editorial === 'string') {
                props.editorial = JSON.parse(props.editorial)
              }

              // Marker
              markers[id] = makerHtmlFactory(
                id,
                markerCoords, // Using this to avoid misplaced marker
                props.display?.color_fill || '#000000',
                props.display?.icon || '#000000',
                props['image:thumbnail'],
                null,
                props.display?.text
              )

              // Click handler
              if (markerClickCallBack && props.editorial?.popup_fields) {
                const el = markers[id].getElement()
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
