import type { IncomingMessage, ServerResponse } from 'node:http'
import { defineEventHandler } from 'h3'
import type { Settings } from '../../lib/apiSettings'

async function manifest(
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
) {
  const hostname = (req.headers['x-forwarded-host'] || req.headers.host)?.toString().split(':')[0]

  if (hostname) {
    const { project, theme: themeSlug } = await $fetch('/api/config')

    const { apiEndpoint } = useRuntimeConfig().public
    const settings = await $fetch<Settings>(`${apiEndpoint}/${project}/${themeSlug}/settings.json`)
    const theme = settings.themes[themeSlug]

    if (!theme)
      throw createError({ statusCode: 500, statusMessage: `Theme ${themeSlug} not found.`, fatal: true })

    res.write(
      JSON.stringify({
        name: theme.title.fr,
        short_name: theme.title.fr,
        description: theme.description.fr,
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
