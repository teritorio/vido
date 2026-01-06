import type { SitemapEntry } from '~/node_modules/nuxt-simple-sitemap/dist/module'
import type { BuildSitemapOptions } from '~/node_modules/nuxt-simple-sitemap/dist/runtime/util/builder'
import { buildSitemap } from '~/node_modules/nuxt-simple-sitemap/dist/runtime/util/builder'
import type { MenuItem } from '~/types/api/menu'
import type { ApiPois } from '~/lib/apiPois'

export default defineEventHandler(async (event) => {
  const hostname = getHeader(event, 'host')

  if (!hostname) {
    setResponseStatus(event, 500)
    return 'Missing host header'
  }

  try {
    // Get all request headers from the original request
    const incomingHeaders = getRequestHeaders(event)

    // Fetch API endpoint configuration
    const { api: apiEndpoint } = await $fetch('/api/config', {
      headers: {
        'x-client-host': hostname,
        ...incomingHeaders,
      },
    })

    // Fetch menu and POIs data in parallel
    const [menuItems, pois] = await Promise.all([
      $fetch<MenuItem[]>(`${apiEndpoint}/menu.json`),
      $fetch<ApiPois>(`${apiEndpoint}/pois.geojson`),
    ])

    // Build sitemap entries
    const entries: SitemapEntry[] = [
      // Static routes
      { url: '/' },
      { url: '/embedded/' },
      // Menu category routes
      ...menuItems
        .filter(item => 'category' in item && item.id)
        .map(category => ({
          url: `/${category.id}/`,
        })),
      // POI detail routes
      ...pois.features.map(poi => ({
        url: `/poi/${poi.properties.metadata.id}/details`,
        lastmod: poi.properties.metadata.updated_at,
      })),
    ]

    // Build sitemap options
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

    // Generate sitemap
    const sitemapContent = await buildSitemap({
      ...options,
      sitemapName: 'default',
    })

    setResponseHeader(event, 'Content-Type', 'application/xml')
    setResponseStatus(event, 200)

    return sitemapContent
  }
  catch (error) {
    console.error('Error generating sitemap:', error)
    setResponseStatus(event, 500)
    return 'Error generating sitemap'
  }
})
