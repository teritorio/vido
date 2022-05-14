import { Plugin } from '@nuxt/types'
import createServer from 'connect'

import { VidoConfig } from '@/utils/types-config'
import vidos from '@/vidos.config'

export function vidoConfig(req: createServer.IncomingMessage): VidoConfig {
  let host: string | undefined
  if (process.server) {
    host = (req.headers['x-forwarded-host'] as string) || req.headers.host
  } else {
    host = window.location.host
  }
  host = host?.split(':')[0]
  if (host && !(host in vidos)) {
    host = undefined
  }
  if (!host) {
    host = Object.keys(vidos)[0]
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
