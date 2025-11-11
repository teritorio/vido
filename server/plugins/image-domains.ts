import type { Settings } from '~/lib/apiSettings'

export default defineNitroPlugin(async () => {
  const { genericApiEndpoint } = useRuntimeConfig().public

  try {
    const configs = await $fetch<Record<string, Settings>>(genericApiEndpoint)

    const domains = [
      ...new Set([
        ...Object.entries(configs)
          .map(([_slug, config]) =>
            Object.entries(config.themes)
              .map(([_slug, theme]) => theme.site_url.fr)
              .filter(Boolean)
              .flat(),
          )
          .flat(),
        ...Object.entries(configs)
          .map(([_slug, config]) => config.image_proxy_hosts)
          .filter(Boolean)
          .flat(),
      ]),
    ]

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
