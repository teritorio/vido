import fs from 'fs'

import { VidosConfig } from '~/utils/types-config'

export const vidos: VidosConfig = !process.env.CONFIG
  ? {}
  : JSON.parse(
      fs.readFileSync(process.env.CONFIG || 'vidos-config.json').toString()
    )
