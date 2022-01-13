import maplibregl from 'maplibre-gl'

import { ApiMenuCategory } from '@/utils/types'

const getMarkerDonutSegment = (
  start: number,
  end: number,
  r: number,
  r0: number,
  color: string
): string => {
  if (end - start === 1) end -= 0.00001
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
    '" fill="' + color + '" />',
  ].join(' ')
}

export const createMarkerDonutChart = (
  categories: Record<ApiMenuCategory['id'], ApiMenuCategory>,
  props: maplibregl.MapboxGeoJSONFeature['properties']
): HTMLElement => {
  const offsets = []

  const countPerColor: { [color: string]: number } = {}
  Object.keys(categories)
    .filter((categoryId) => ((props && props[categoryId]) || 0) > 0)
    .forEach((categoryIdString) => {
      const categoryId = parseInt(categoryIdString, 10)
      const color = categories[categoryId].category.color
      if (countPerColor[color]) {
        countPerColor[color] += (props && props[categoryId]) || 0
      } else {
        countPerColor[color] = (props && props[categoryId]) || 0
      }
    })

  const counts: number[] = Object.values(countPerColor)
  const colors = Object.keys(countPerColor)
  let total = 0
  for (let i = 0; i < counts.length; i++) {
    offsets.push(total)
    total += counts[i]
  }

  const r = total >= 1000 ? 40 : total >= 100 ? 32 : total >= 10 ? 24 : 16
  const r0 = r - 5
  const w = r * 2

  let html = `<svg width="${w}" height="${w}" viewbox="0 0 ${w} ${w}" text-anchor="middle" class="cluster-donut">`

  for (let i = 0; i < counts.length; i++) {
    html += getMarkerDonutSegment(
      offsets[i] / total,
      (offsets[i] + counts[i]) / total,
      r,
      r0,
      colors[i]
    )
  }
  html += `<circle cx="${r}" cy="${r}" r="${r0}" fill="white" />
      <text dominant-baseline="central" transform="translate(${r}, ${r})">
        ${total.toLocaleString()}
      </text>
    </svg>`

  const el = document.createElement('div')
  el.innerHTML = html
  return el
}
