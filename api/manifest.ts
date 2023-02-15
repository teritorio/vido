import express from 'express'
import { eventHandler } from 'h3'

import { getSettings } from '../lib/apiSettings'
import { vidos } from '../lib/config'
import { vidoConfigResolve } from '../plugins/vido-config'
import { VidoConfig } from '../utils/types-config'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get(
  '/manifest.webmanifest',
  eventHandler(async (event) => {
    const req = event.node.req
    const res = event.node.res

    const vido: VidoConfig = vidoConfigResolve(
      new URL(req.url!).hostname,
      vidos
    )
    const fetchSettings = getSettings(
      vido.API_ENDPOINT,
      vido.API_PROJECT,
      vido.API_THEME
    )

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
      })
    )
  })
)

export default app
