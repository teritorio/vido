import { groupBy } from 'lodash'

import { getMenu } from './apiMenu'
import { getPois } from './apiPois'

import { VidosConfig } from '~/utils/types-config'

export function sitemapRoutes(vidos: VidosConfig): Promise<{ url: string }[]> {
  const groups = groupBy(
    Object.entries(vidos).filter(([hostname, vido]) => vido instanceof Object),
    ([hostname, vido]) =>
      `${vido.API_ENDPOINT}/${vido.API_PROJECT}/${vido.API_THEME}`
  )
  const apis = Object.fromEntries(
    Object.entries(groups).map(([key, values]) => [
      key,
      {
        api: [
          values[0][1].API_ENDPOINT,
          values[0][1].API_PROJECT,
          values[0][1].API_THEME,
        ],
        hostnames: values.map(([hostname, vido]) => hostname),
      },
    ])
  )

  const proms: Promise<{ url: string }[]>[] = Object.keys(apis)
    .map((key) => [
      getMenu(apis[key].api[0], apis[key].api[1], apis[key].api[2]).then(
        (menuItems) => {
          return apis[key].hostnames
            .map((hostname) =>
              menuItems
                .filter((menuItem) => menuItem.category && menuItem.id)
                .map((menuCategory) => ({
                  url: `/${menuCategory.id}/`,
                  hostname,
                }))
            )
            .flat(1)
        }
      ),
      getPois(apis[key].api[0], apis[key].api[1], apis[key].api[2], undefined, {
        geometry_as: 'point',
        short_description: true,
      }).then((pois) => {
        return apis[key].hostnames
          .map((hostname) =>
            pois.features.map((poi) => ({
              url: `/poi/${poi.properties.metadata.id}/details`,
              lastmod: poi.properties.metadata.updated_at,
              hostname,
            }))
          )
          .flat(1)
      }),
    ])
    .flat(1)

  return Promise.all([...proms]).then((all) => [
    {
      url: '/',
    },
    ...all.flat(2),
  ])
}

export function sitemapFilter({
  routes,
  options,
}: {
  routes: { url: string; hostname?: string }[]
  options: { hostname: string }
}) {
  const hostname = options.hostname.split('/')[1].split(':')[0]
  routes = routes.filter((route) => {
    return !route.hostname || route.hostname == hostname
  })
  return routes
}
