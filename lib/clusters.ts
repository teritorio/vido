import { createApp } from 'vue'
import { type Map, Marker } from 'maplibre-gl'
import type { ApiPoi } from './apiPois'
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

export function createDeclusterizedCluster(
  features: GeoJSON.Feature[],
  clusterCoords: [number, number],
  map: Map,
  markerClickCallBack: ((feature: ApiPoi) => void) | undefined,
): HTMLElement {
  const clusterWrapper = document.createElement('div')
  features.forEach((feature, index) => {
    const el = document.createElement('div')
    el.id = `m${feature.id}`

    createApp(TeritorioIconBadge, {
      colorFill: feature.properties?.display.color_fill,
      picto: feature.properties?.display.icon,
      image: feature.properties!['image:thumbnail'],
      size: null,
      text: feature.properties?.display.name,
    }).mount(el)

    if (feature.properties?.editorial?.popup_fields) {
      el.addEventListener('click', (e: MouseEvent) => {
        e.stopPropagation()

        const middle = features.length / 2
        const offset
          = index + 1 <= middle
            ? ((index + 1 - middle) * 32) - 16
            : ((index - middle) * 32) + 16

        new Marker({
          scale: 1.3,
          color: '#f44336',
        })
          .setLngLat(clusterCoords)
          .setOffset([offset, -10])
          .addTo(map as Map)

        if (markerClickCallBack)
          markerClickCallBack(feature as ApiPoi)
      })
    }

    clusterWrapper.append(el)
  })
  clusterWrapper.classList.add('cluster-item', 'cluster-declusterized')
  return clusterWrapper
}

export function createMarkerDonutChart(countPerColor: Record<string, number>, totalCount: number): HTMLElement {
  const r
    = totalCount >= 1000
      ? 40
      : totalCount >= 100
        ? 32
        : totalCount >= 10
          ? 24
          : 16
  const r0 = r - 5
  const w = r * 2

  let html = `<svg width="${w}" height="${w}" viewbox="0 0 ${w} ${w}" text-anchor="middle" class="cluster-donut">`

  let total = 0
  let offsets = 0
  Object.entries(countPerColor).forEach(([color, count]) => {
    total += count
    html += getMarkerDonutSegment(
      offsets / totalCount,
      total / totalCount,
      r,
      r0,
      color,
    )
    offsets = total
  })

  if (total !== totalCount)
    html += getMarkerDonutSegment(total / totalCount, 1, r, r0, '#ccc')

  html += `<circle cx="${r}" cy="${r}" r="${r0}" fill="white" />
      <text dominant-baseline="central" transform="translate(${r}, ${r})">
        ${totalCount.toLocaleString()}
      </text>
    </svg>`

  const el = document.createElement('div')
  el.innerHTML = html
  return el
}
