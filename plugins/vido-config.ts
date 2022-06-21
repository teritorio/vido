import { Plugin } from '@nuxt/types'
import createServer from 'connect'

import { VidoConfig } from '@/utils/types-config'
import vidos from '@/vidos.config'

export function vidoConfig(req: createServer.IncomingMessage): VidoConfig {
  let host: string
  if (process.server) {
    const hostHeader =
      (req.headers['x-forwarded-host'] as string) || req.headers.host
    if (!hostHeader) {
      throw new Error('No header "Host" nor "x-forwarded-host"')
    } else {
      host = hostHeader
    }
  } else {
    host = window.location.host
  }
  host = host?.split(':')[0]
  if (!(host in vidos)) {
    throw new Error(`Not configured host "${host}"`)
  }
  return {
    ...vidos[host],
  }
}

const vidosConfigPlugin: Plugin = ({ req }, inject) => {
  inject('vidoConfig', vidoConfig(req))
}

export default vidosConfigPlugin

declare module 'vue/types/vue' {
  interface Vue {
    readonly $vidoConfig: VidoConfig
  }
}
