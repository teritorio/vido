import type { Settings } from '~/lib/apiSettings'

export default defineNitroPlugin(async () => {
  const { genericApiEndpoint, appHost } = useRuntimeConfig().public

  try {
    const configs = await $fetch<Record<string, Settings>>(genericApiEndpoint)

    const domains = Object.fromEntries(
      Object.entries(configs).map(([slug, config]) => {
        const urls = Object.values(config.themes)
          .map((theme) => {
            return [
              new URL(theme.site_url?.fr || '').host,
              import.meta.dev
                ? `${theme.slug}-${slug}.${new URL(genericApiEndpoint).host}`
                : `${theme.slug}-${slug}.${appHost}`,
            ]
          })
          .filter(Boolean)
          .flat()

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
    globalThis.allowedDomains = []
  }
})
