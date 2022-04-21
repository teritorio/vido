import { Plugin } from '@nuxt/types'
import createServer from 'connect'

import { VidoConfig } from '@/utils/types'
import vidos from '@/vidos.config'

export function vidoConfig(req: createServer.IncomingMessage): VidoConfig {
  let { host } = process.server ? req.headers : window.location
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
    $vidoConfig: VidoConfig
  }
}
