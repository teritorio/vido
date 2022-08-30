import { StyleSpecification, Map, ExpressionSpecification } from 'maplibre-gl'

import { ApiPoiId } from '~/lib/apiPois'

export const fetchStyle = (
  styleUrl: string,
  extraAttributions: string[]
): Promise<StyleSpecification> => {
  return fetch(styleUrl)
    .then((res) => res.json())
    .then(async (style: any) => {
      const vectoSources: {
        url: string
        attribution: string
      }[] = Object.values(style.sources)
      const vectoSourceUrl: string[] = vectoSources
        .map((src: any) => src.url)
        .filter((url) => url)

      const vectoSourceAttribution = await Promise.all(
        vectoSourceUrl.map((url) => {
          if (!url) return null

          return fetch(url)
            .then((res) => res.json())
            .then((res) => {
              return res.attribution
            })
        })
      )

      let nuAttribution = ''

      vectoSourceAttribution.forEach((attr, i) => {
        if (attr) {
          const existingAttributions = extraAttributions.filter(
            (att: string) => !attr.includes(att)
          )

          nuAttribution += [attr].concat(existingAttributions).join(' ')
        } else if (vectoSources[i]?.attribution) {
          nuAttribution += ' ' + vectoSources[i]?.attribution
        }
      })

      const nuStyle = { ...style }

      Object.keys(style.sources).forEach((key) => {
        nuStyle.sources[key] = {
          ...style.sources[key],
          attribution: nuAttribution,
        }
      })

      return nuStyle
    })
}

export const filterRouteByCategories = (
  map: Map,
  categorieIds: (number | string)[]
) => {
  if (map && map.getLayer('features-line-casing')) {
    const categorieIdsCond: ExpressionSpecification[] = categorieIds.map(
      (categorieId) => ['in', `;${categorieId};`, ['get', 'category_ids']]
    )
    const filter: ExpressionSpecification = ['any', ...categorieIdsCond]
    map.setLayoutProperty('features-line-casing', 'visibility', 'visible')
    map.setLayoutProperty('features-line', 'visibility', 'visible')
    map.setLayoutProperty('features-fill', 'visibility', 'visible')
    map.setLayoutProperty('features-outline', 'visibility', 'visible')
    const isLineString = ['==', ['geometry-type'], 'LineString']
    const isPolygon = ['==', ['geometry-type'], 'Polygon']
    // @ts-ignore Inchorent MapLibre type checking in 2.3
    map.setFilter('features-line-casing', ['all', filter, isLineString])
    // @ts-ignore Inchorent MapLibre type checking in 2.3
    map.setFilter('features-line', ['all', filter, isLineString])
    // @ts-ignore Inchorent MapLibre type checking in 2.3
    map.setFilter('features-fill', ['all', filter, isPolygon])
    // @ts-ignore Inchorent MapLibre type checking in 2.3
    map.setFilter('features-outline', ['all', filter, isPolygon])
  }
}

export const filterRouteByPoiId = (map: Map, id: ApiPoiId) => {
  if (map && map.getLayer('features-line-casing')) {
    map.setLayoutProperty('features-line-casing', 'visibility', 'visible')
    map.setLayoutProperty('features-line', 'visibility', 'visible')
    map.setLayoutProperty('features-fill', 'visibility', 'visible')
    map.setLayoutProperty('features-outline', 'visibility', 'visible')
    const isLineString = ['==', ['geometry-type'], 'LineString']
    const isPolygon = ['==', ['geometry-type'], 'Polygon']
    const id_ = id as number
    map.setFilter('features-line-casing', [
      // @ts-ignore Inchorent MapLibre type checking in 2.3
      'all',
      ['==', ['id'], id_],
      isLineString,
    ])
    // @ts-ignore Inchorent MapLibre type checking in 2.3
    map.setFilter('features-line', ['all', ['==', ['id'], id_], isLineString])
    // @ts-ignore Inchorent MapLibre type checking in 2.3
    map.setFilter('features-fill', ['all', ['==', ['id'], id_], isPolygon])
    // @ts-ignore Inchorent MapLibre type checking in 2.3
    map.setFilter('features-outline', ['all', ['==', ['id'], id_], isPolygon])
  }
}
