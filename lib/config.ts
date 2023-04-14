import fs from 'fs'

import { VidosConfig } from '~/utils/types-config'

let config: VidosConfig | undefined = undefined

export function vidos(): VidosConfig {
  config =
    config ||
    JSON.parse(
      fs.readFileSync(process.env.CONFIG || 'vidos-config.json').toString()
    )
  return config!
}
