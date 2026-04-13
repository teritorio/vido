import type { Settings } from '~/lib/apiSettings'

export default defineNitroPlugin(async () => {
  const { genericApiEndpoint, appHost } = useRuntimeConfig().public

  try {
    const configs = await $fetch<Record<string, Settings>>(genericApiEndpoint)

    const domains = Object.fromEntries(
      Object.entries(configs).map(([slug, config]) => {
        const urls = Object.values(config.themes)
          .flatMap((theme) => {
            const siteUrl = theme.site_url?.fr
            const devOrProdHost = import.meta.dev
              ? `${theme.slug}-${slug}.${new URL(genericApiEndpoint).host}`
              : `${theme.slug}-${slug}.${appHost}`

            if (!siteUrl)
              return [devOrProdHost]

            try {
              return [new URL(siteUrl).host, devOrProdHost]
            }
            catch {
              return [devOrProdHost]
            }
          })

        const imageHosts = Array.isArray(config.image_proxy_hosts)
          ? config.image_proxy_hosts
          : config.image_proxy_hosts
            ? [config.image_proxy_hosts]
            : []
        const values = Array.from(new Set([...urls, ...imageHosts]))

        return [slug, [...values, 'api.panoramax.xyz']]
      }),
    )

    // @ts-expect-error: can't declare the interface
    globalThis.allowedDomains = domains

    // eslint-disable-next-line no-console
    console.info(`✅ Loaded allowed domains at startup.`)
  }
  catch (err) {
    console.error('❌ Failed to fetch allowed domains at startup:', err)
    // @ts-expect-error: can't declare the interface
    globalThis.allowedDomains = {}
  }
})
