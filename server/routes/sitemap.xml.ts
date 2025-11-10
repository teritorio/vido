import type { IncomingMessage, ServerResponse } from 'node:http'
import { defineEventHandler } from 'h3'
import type { SitemapEntry } from '~/node_modules/nuxt-simple-sitemap/dist/module'
import type { BuildSitemapOptions } from '~/node_modules/nuxt-simple-sitemap/dist/runtime/util/builder'
import { buildSitemap } from '~/node_modules/nuxt-simple-sitemap/dist/runtime/util/builder'
import type { MenuItem } from '~/lib/apiMenu'
import type { ApiPois } from '~/lib/apiPois'

// Import by node_modules because access to internal module content

async function manifest(
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
) {
  const hostname = req.headers.host?.toString()

  if (hostname) {
    const { api: apiEndpoint } = await $fetch('/api/config', {
      headers: {
        'x-client-host': hostname,
      },
    })

    const entries: SitemapEntry[] = (await Promise.all([
      await $fetch<MenuItem[]>(`${apiEndpoint}/menu.json`)
        .then(menuItem => menuItem
          .filter(menuItem => menuItem.category && menuItem.id)
          .map(menuCategory => ({
            url: `/${menuCategory.id}/`,
          })),
        ),
      await $fetch<ApiPois>(`${apiEndpoint}/pois.geojson`)
        .then(pois => pois.features.map(poi => ({
          url: `/poi/${poi.properties.metadata.id}/details`,
          lastmod: poi.properties.metadata.updated_at,
        })),
        ),
    ])).flat(1)

    entries.push({
      url: '/',
    })
    entries.push({
      url: '/embedded/',
    })

    const options: BuildSitemapOptions = {
      sitemapConfig: {
        dynamicUrlsApiEndpoint: '/__sitemap',
        discoverImages: false,
        xsl: '/sitemap-style.xsl',
        defaults: {},
        enabled: true,
        trailingSlash: false,
        siteUrl: `https://${hostname}`,
        autoLastmod: false,
        inferStaticPagesAsRoutes: false,
        //  sitemaps?: boolean | Record<string, Partial<SitemapRoot>>;
        hasApiRoutesUrl: false,
        hasPrerenderedRoutesPayload: false,
        isNuxtContentDocumentDriven: false,
        urls: entries,
        sitemapName: 'sitemap.xml',
      },
      baseURL: `https://${hostname}`,
      getRouteRulesForPath(_path: string): Record<string, any> {
        return {}
      },
    }

    res.write(
      await buildSitemap({
        ...options,
        sitemapName: 'default',
      }),
    )

    res.statusCode = 200
    res.end()
  }
  else {
    res.statusCode = 500
    res.end()
  }
}

export default defineEventHandler(
  async event => await manifest(event.node.req, event.node.res),
)
