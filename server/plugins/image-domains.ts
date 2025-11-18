import type { Settings } from '~/lib/apiSettings'

export default defineNitroPlugin(async () => {
  const { genericApiEndpoint } = useRuntimeConfig().public

  try {
    const configs = await $fetch<Record<string, Settings>>(genericApiEndpoint)

    const domains = Object.fromEntries(
      Object.entries(configs).map(([slug, config]) => {
        const devUrls = [] as string[]
        const urls = Object.values(config.themes)
          .map((theme) => {
            devUrls.push(`${theme.slug}-${slug}.elasa-dev.teritorio.xyz`)
            return new URL(theme.site_url?.fr).hostname
          })
          .filter(Boolean)

        const hosts = Array.isArray(config.image_proxy_hosts)
          ? config.image_proxy_hosts
          : config.image_proxy_hosts
            ? [config.image_proxy_hosts]
            : []
        const values = Array.from(new Set([...urls, ...devUrls, ...hosts]))

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
