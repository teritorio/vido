import type { IncomingMessage, ServerResponse } from 'node:http'
import { defineEventHandler } from 'h3'

import { getSettings } from '../../lib/apiSettings'
import { vidos } from '../../lib/config'
import { vidoConfigResolve } from '../../plugins/vido-config'
import type { VidoConfig } from '../../utils/types-config'

async function manifest(
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
) {
  const hostname = (req.headers['x-forwarded-host'] || req.headers.host) as
    | string
    | undefined
  if (hostname) {
    const vido: VidoConfig = vidoConfigResolve(hostname, vidos())
    const fetchSettings = getSettings(vido)

    const [settings] = await Promise.all([fetchSettings])

    res.write(
      JSON.stringify({
        name: settings.themes[0].title.fr,
        short_name: settings.themes[0].title.fr,
        description: settings.themes[0].description.fr,
        start_url: '.',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: settings.themes[0].favicon_url,
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
