import type {
  ExpressionSpecification,
  FilterSpecification,
  Map,
  StyleSpecification,
  VectorSourceSpecification,
} from 'maplibre-gl'

import type { ApiPoiId } from '~/lib/apiPois'
import { removeDuplicateAttributions } from '~/utils/utilities'

export function fetchStyle(styleUrl: string, extraAttributions: string[]): Promise<StyleSpecification> {
  return fetch(styleUrl)
    .then(res => res.json())
    .then(async (style: any) => {
      const vectoSources: {
        url: string
        attribution: string
      }[] = Object.values(style.sources)

      const vectoSourceUrl: string[] = vectoSources
        .map((src: any) => src.url)
        .filter(url => url)

      const vectoSourcesLocal: string[] = vectoSources
        .filter((source: any) => source.tiles?.length)
        .map((source: any) => source.attribution)

      const vectoSourceAttribution = (
        await Promise.all(
          vectoSourceUrl
            .filter(url => !!url)
            .map(url =>
              fetch(url)
                .then(res => res.json())
                .then((res: VectorSourceSpecification) =>
                  res.attribution
                    ?.replaceAll('&copy;', '©')
                    .replaceAll('> <', '>,<')
                    .split(','),
                ),
            ),
        )
      ).filter(attrs => !!attrs)

      extraAttributions = extraAttributions.map(attr =>
        attr.replaceAll('&copy;', '©'),
      )

      const nuAttribution = [
        ...new Set([...vectoSourceAttribution.flat(1), ...vectoSourcesLocal, ...extraAttributions]),
      ].join(' ')

      const nuStyle = { ...style }

      Object.keys(style.sources).forEach((key) => {
        nuStyle.sources[key] = {
          ...style.sources[key],
          attribution: removeDuplicateAttributions(nuAttribution),
        }
      })

      return nuStyle
    })
}

export function filterRouteByCategories(map: Map, categorieIds: (number | string)[]) {
  if (map && map.getLayer('features-line-casing')) {
    const categorieIdsCond: ExpressionSpecification[] = categorieIds.map(
      categorieId => ['in', `;${categorieId};`, ['get', 'category_ids']],
    )
    const filter: ExpressionSpecification = ['any', ...categorieIdsCond]
    map.setLayoutProperty('features-line-casing', 'visibility', 'visible')
    map.setLayoutProperty('features-line', 'visibility', 'visible')
    map.setLayoutProperty('features-fill', 'visibility', 'visible')
    map.setLayoutProperty('features-outline', 'visibility', 'visible')
    const isLineString: FilterSpecification = ['==', ['geometry-type'], 'LineString']
    const isPolygon: FilterSpecification = ['==', ['geometry-type'], 'Polygon']
    map.setFilter('features-line-casing', ['all', filter, isLineString])
    map.setFilter('features-line', ['all', filter, isLineString])
    map.setFilter('features-fill', ['all', filter, isPolygon])
    map.setFilter('features-outline', ['all', filter, isPolygon])
  }
}

export function filterRouteByPoiIds(map: Map, ids: ApiPoiId[]) {
  if (map && map.getLayer('features-line-casing')) {
    map.setLayoutProperty('features-line-casing', 'visibility', 'visible')
    map.setLayoutProperty('features-line', 'visibility', 'visible')
    map.setLayoutProperty('features-fill', 'visibility', 'visible')
    map.setLayoutProperty('features-outline', 'visibility', 'visible')
    const isLineString: FilterSpecification = ['==', ['geometry-type'], 'LineString']
    const isPolygon: FilterSpecification = ['==', ['geometry-type'], 'Polygon']
    const ids_ = ids as number[]
    map.setFilter('features-line-casing', ['all', ['in', ['id'], ['literal', ids_]], isLineString])
    map.setFilter('features-line', ['all', ['in', ['id'], ['literal', ids_]], isLineString])
    map.setFilter('features-fill', ['all', ['in', ['id'], ['literal', ids_]], isPolygon])
    map.setFilter('features-outline', ['all', ['in', ['id'], ['literal', ids_]], isPolygon])
  }
}
