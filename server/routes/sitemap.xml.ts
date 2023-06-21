import { defineEventHandler } from 'h3'
import { IncomingMessage, ServerResponse } from 'node:http'

import { getMenu } from '~/lib/apiMenu'
import { getPois } from '~/lib/apiPois'
import { vidos } from '~/lib/config'
import { SitemapFullEntry } from '~/node_modules/nuxt-simple-sitemap/dist/module'
import {
  buildSitemap,
  BuildSitemapOptions,
  generateXslStylesheet,
} from '~/node_modules/nuxt-simple-sitemap/dist/runtime/util/builder'
import { vidoConfigResolve } from '~/plugins/vido-config'
import { VidoConfig } from '~/utils/types-config'

// Import by node_modules because access to internal module content

async function manifest(
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
) {
  const hostname = (req.headers['x-forwarded-host'] || req.headers.host) as
    | string
    | undefined
  if (hostname) {
    const vido: VidoConfig = vidoConfigResolve(hostname, vidos())

    const menu = getMenu(vido).then((menuItem) =>
      menuItem
        .filter((menuItem) => menuItem.category && menuItem.id)
        .map((menuCategory) => ({
          url: `/${menuCategory.id}/`,
        }))
    )

    const pois = getPois(vido).then((apiPois) =>
      apiPois.features.map((poi) => ({
        url: `/poi/${poi.properties.metadata.id}/details`,
        lastmod: poi.properties.metadata.updated_at,
      }))
    )

    const entries: SitemapFullEntry[] = (await Promise.all([menu, pois])).flat(
      1
    )

    entries.push({
      url: '/',
    })
    entries.push({
      url: '/embedded/',
    })

    const options: BuildSitemapOptions = {
      sitemapConfig: {
        xsl: '/sitemap-style.xsl',
        defaults: {},
        enabled: true,
        trailingSlash: false,
        siteUrl: `https://${hostname}`,
        autoLastmod: false,
        inferStaticPagesAsRoutes: false,
        //  sitemaps?: boolean | Record<string, Partial<SitemapRoot>>;
        hasApiRoutesUrl: false,
        isNuxtContentDocumentDriven: false,
        urls: entries,
      },
      baseURL: `https://${hostname}`,
      getRouteRulesForPath(path: string): Record<string, any> {
        return {}
      },
    }

    res.write(
      await buildSitemap({
        ...options,
        sitemapName: 'default',
      })
    )

    res.statusCode = 200
    res.end()
  } else {
    res.statusCode = 500
    res.end()
  }
}

export default defineEventHandler(
  async (event) => await manifest(event.node.req, event.node.res)
)
