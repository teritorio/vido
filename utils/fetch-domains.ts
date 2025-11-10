import { config } from 'dotenv'
import type { Settings } from '~/lib/apiSettings'

export async function fetchDynamicDomains() {
  try {
    config()
    const genericApiEndpoint = process.env.NUXT_PUBLIC_GENERIC_API_ENDPOINT

    if (!genericApiEndpoint)
      throw new Error('Missing genericApiEndpoint.')

    await fetch(genericApiEndpoint)
      .then((data: Response) => {
        if (data.ok) {
          return data.json() as unknown as Record<string, Settings>
        }
        else {
          return Promise.reject(
            new Error([data.url, data.status, data.statusText].join(' ')),
          )
        }
      })
      .then((configs: Record<string, Settings>) => {
        const domains = [
          ...Object.entries(configs).map(([_slug, config]) => Object.entries(config.themes).map(([_slug, theme]) => theme.site_url.fr).filter(Boolean).flat()).flat(),
          ...Object.entries(configs).map(([_slug, config]) => config.image_proxy_hosts).filter(Boolean).flat(),
        ]
        const domainsStr = domains.join(',')

        // eslint-disable-next-line no-console
        console.log(domainsStr)
      })
  }
  catch (error) {
    console.error('Failed to fetch domains:', error)
    process.exit(1)
  }
}

fetchDynamicDomains()
