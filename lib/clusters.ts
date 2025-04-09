import type { LngLatLike, MapGeoJSONFeature, Point } from 'maplibre-gl'
import { Marker } from 'maplibre-gl'
import { createApp } from 'vue'
import TeritorioIconBadge from '~/components/UI/TeritorioIconBadge.vue'

function getMarkerDonutSegment(start: number, end: number, r: number, r0: number, colorFill: string): string {
  if (end - start === 1)
    end -= 0.00001
  const a0 = 2 * Math.PI * (start - 0.25)
  const a1 = 2 * Math.PI * (end - 0.25)
  const x0 = Math.cos(a0)
  const y0 = Math.sin(a0)
  const x1 = Math.cos(a1)
  const y1 = Math.sin(a1)
  const largeArc = end - start > 0.5 ? 1 : 0

  return [
    '<path d="M',
    r + r0 * x0,
    r + r0 * y0,
    'L',
    r + r * x0,
    r + r * y0,
    'A',
    r,
    r,
    0,
    largeArc,
    1,
    r + r * x1,
    r + r * y1,
    'L',
    r + r0 * x1,
    r + r0 * y1,
    'A',
    r0,
    r0,
    0,
    largeArc,
    0,
    r + r0 * x0,
    r + r0 * y0,
    `" fill="${colorFill}" />`,
  ].join(' ')
}

export function clusterRender(element: HTMLDivElement, props: MapGeoJSONFeature['properties']) {
  const {
    cluster: _a,
    cluster_id: _b,
    point_count,
    _c: _d,
    point_count_abbreviated: _e,
    ...countPercolor
  } = props

  const r = point_count >= 1000
    ? 40
    : point_count >= 100
      ? 32
      : point_count >= 10
        ? 24
        : 16
  const r0 = r - 5
  const w = r * 2

  let html = `<svg width="${w}" height="${w}" viewbox="0 0 ${w} ${w}" text-anchor="middle" class="cluster-donut">`

  let total = 0
  let offsets = 0
  Object.entries(countPercolor).forEach(([color, count]) => {
    total += count
    html += getMarkerDonutSegment(
      offsets / point_count,
      total / point_count,
      r,
      r0,
      color,
    )
    offsets = total
  })

  if (total !== point_count)
    html += getMarkerDonutSegment(total / point_count, 1, r, r0, '#ccc')

  html += `<circle cx="${r}" cy="${r}" r="${r0}" fill="white" />
      <text dominant-baseline="central" transform="translate(${r}, ${r})">
        ${point_count.toLocaleString()}
      </text>
    </svg>`

  element.style.cursor = 'pointer'
  element.innerHTML = html
}

export function markerRender(element: HTMLDivElement, feature: MapGeoJSONFeature) {
  element.style.cursor = 'pointer'

  if (typeof feature.properties?.metadata === 'string')
    feature.properties.metadata = JSON.parse(feature.properties.metadata)

  if (typeof feature.properties?.display === 'string')
    feature.properties.display = JSON.parse(feature.properties?.display)

  if (typeof feature.properties?.editorial === 'string')
    feature.properties.editorial = JSON.parse(feature.properties?.editorial)

  createApp(TeritorioIconBadge, {
    colorFill: feature.properties['route:point:type'] ? (feature.properties.display?.color_text || '#FFF') : feature.properties.display?.color_fill,
    colorText: feature.properties['route:point:type'] ? feature.properties.display?.color_fill : (feature.properties.display?.color_text || '#FFF'),
    picto: feature.properties.display?.icon,
    image: feature.properties!['image:thumbnail'],
    size: null,
    text: feature.properties.display?.text,
  }).mount(element)
}

export function pinMarkerRender(coords: LngLatLike, offset: Point): Marker {
  return new Marker({ scale: 1.3, color: '#f44336', anchor: 'bottom' }).setLngLat(coords).setOffset(offset)
}
