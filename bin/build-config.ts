import vidos from '../vidos.config'

import type { VidoConfig } from '~/utils/types-config'

const vidoHostConfig: { [key: string]: VidoConfig } = {}
Object.values(vidos).forEach((vido) => {
  vido.HOSTS.forEach((host) => {
    vidoHostConfig[host] = vido
  })
})

process.stdout.write(JSON.stringify(vidoHostConfig, null, 4))
