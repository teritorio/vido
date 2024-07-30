import type {
  FitBoundsOptions,
  GeoJSONSource,
  LayerSpecification,
  LngLatBounds,
  Map,
  Marker,
  SymbolLayerSpecification,
} from 'maplibre-gl'
import { createApp } from 'vue'

import type { ApiPoi } from './apiPois'
import { getBBoxFeatures } from './bbox'
import { createMarkerDonutChart } from './clusters'

import TeritorioIconBadge from '~/components/UI/TeritorioIconBadge.vue'
import type { TupleLatLng } from '~/utils/types'
import { createMarker } from '~/composables/useMarker'

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

export function makerHtmlFactory(
  id: string,
  latLng: TupleLatLng,
  colorFill: string,
  icon: string,
  thumbnail: string | undefined,
  size: string | null = null,
  text?: string,
): Marker {
  // Marker
  const el: HTMLElement = document.createElement('div')
  el.id = id
  el.classList.add('maplibregl-marker')
  el.classList.add('cluster-item')

  const marker = createMarker(latLng, {
    element: el,
    ...(thumbnail && {
      offset: [0, -10],
    }),
  })

  // Teritorio badge
  createApp(TeritorioIconBadge, {
    colorFill,
    picto: icon,
    image: thumbnail,
    size,
    text,
  }).mount(el)

  return marker
}

export function updateMarkers(
  map: Map,
  markers: { [id: string]: Marker },
  src: string,
  fitBounds: (bounds: LngLatBounds, options: FitBoundsOptions) => void,
  markerClickCallBack: ((feature: ApiPoi, marker?: Marker) => void) | undefined,
) {
  const markerIdPrevious = Object.keys(markers)
  const markerIdcurrent: string[] = []

  const features = map.querySourceFeatures(src).filter(feature => feature.geometry.type === 'Point')
  // for every cluster on the screen, create an HTML marker for it (if we didn't yet),
  // and add it to the map if it's not there already
  for (let i = 0; i < features.length; i++) {
    const coords = (features[i].geometry as GeoJSON.Point).coordinates as [
      number,
      number,
    ]
    const props = features[i].properties
    if (props?.cluster) {
      const id = `c${props.cluster_id}`
      markerIdcurrent.push(id)
      if (!markers[id]) {
        const {
          cluster: _a,
          cluster_id: _b,
          point_count,
          _c: _d,
          point_count_abbreviated: _e,
          ...countPercolor
        } = props
        const element = createMarkerDonutChart(countPercolor, point_count)

        markers[id] = createMarker(coords, { element })
        markers[id].addTo(map)

        element.addEventListener('click', async (e) => {
          e.stopPropagation()
          const source = map.getSource(src) as GeoJSONSource

          if (source && 'getClusterLeaves' in source) {
            const leaves = await source.getClusterLeaves(props.cluster_id, props.point_count, 0)
            if (leaves.length) {
              const bounds = getBBoxFeatures(leaves)
              if (bounds)
                fitBounds(bounds, {})
            }
          }
        })
      }
    }
    else if (props?.metadata) {
      if (typeof props.metadata === 'string')
        props.metadata = JSON.parse(props.metadata)

      const id = `m${features[i].id}`
      markerIdcurrent.push(id)

      // Workaround to correct shifting POI markers after zoom-in
      if (!markers[id] || (markers[id] && (markers[id]?.getLngLat().lat !== (features[i].geometry as GeoJSON.Point).coordinates[1]))) {
        if (markers[id])
          markers[id].remove()

        const markerCoords
            = features[i].geometry.type === 'Point'
            && ((features[i].geometry as GeoJSON.Point).coordinates as TupleLatLng)
        if (markerCoords) {
          if (typeof props.display === 'string')
            props.display = JSON.parse(props.display)

          if (typeof props.editorial === 'string')
            props.editorial = JSON.parse(props.editorial)

          // Marker
          markers[id] = makerHtmlFactory(
            id,
            markerCoords, // Using this to avoid misplaced marker
            props.display?.color_fill || '#000000',
            props.display?.icon || '#000000',
            props['image:thumbnail'],
            null,
            props.display?.text,
          )

          // Click handler
          if (markerClickCallBack && props.editorial?.popup_fields) {
            const el = markers[id].getElement()

            el.addEventListener('click', (e: MouseEvent) => {
              e.stopPropagation()
              const pinMarker = createMarker(markerCoords)

              markerClickCallBack(features[i] as unknown as ApiPoi, pinMarker)
            })
          }
          markers[id].addTo(map)
        }
      }
    }
  }

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
