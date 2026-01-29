import type { Settings } from '~/lib/apiSettings'

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
    const { api: apiEndpoint, theme: themeSlug } = await $fetch('/api/config', {
      headers: {
        'x-client-host': hostname,
        ...incomingHeaders,
      },
    })

    const settings = await $fetch<Settings>(`${apiEndpoint}/settings.json`)
    const theme = settings.themes[themeSlug]

    if (!theme)
      throw createError({ statusCode: 500, statusMessage: `Theme ${themeSlug} not found.`, fatal: true })

    setResponseHeader(event, 'Content-Type', 'application/json')
    setResponseStatus(event, 200)

    return JSON.stringify({
      name: theme.title?.fr,
      short_name: theme.title?.fr,
      description: theme.description?.fr,
      start_url: '.',
      background_color: '#ffffff',
      display: 'standalone',
      icons: [
        {
          src: theme.favicon_url,
          sizes: '192x192',
          type: 'image/png',
        },
      ],
    })
  }
  catch (error) {
    console.error('Error generating manifest:', error)
    setResponseStatus(event, 500)
    return 'Error generating manifest'
  }
})
