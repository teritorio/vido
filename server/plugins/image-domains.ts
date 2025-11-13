import type { Settings } from '~/lib/apiSettings'

export default defineNitroPlugin(async () => {
  const { genericApiEndpoint } = useRuntimeConfig().public

  try {
    const configs = await $fetch<Record<string, Settings>>(genericApiEndpoint)

    const domains = Object.fromEntries(
      Object.entries(configs).map(([slug, config]) => {
        const urls = Object.values(config.themes)
          .map(theme => theme.site_url?.fr)
          .filter(Boolean)

        const hosts = Array.isArray(config.image_proxy_hosts)
          ? config.image_proxy_hosts
          : config.image_proxy_hosts
            ? [config.image_proxy_hosts]
            : []
        const values = Array.from(new Set([...urls, ...hosts]))

        return [slug, values]
      }),
    )

    // @ts-expect-error: can't declare the interface
    globalThis.allowedDomains = domains

    // eslint-disable-next-line no-console
    console.info(`✅ Loaded ${domains.length} allowed domains at startup.`)
  }
  catch (err) {
    console.error('❌ Failed to fetch allowed domains at startup:', err)
    // @ts-expect-error: can't declare the interface
    globalThis.allowedDomains = []
  }
})
