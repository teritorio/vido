import { Plugin } from '@nuxt/types'
import createServer from 'connect'

import vidos from '../vidos.config'

import { VidoConfig } from '~/utils/types-config'

const vidoHostConfig: { [key: string]: VidoConfig } = {}
Object.values(vidos).forEach((vido) => {
  vido.HOSTS.forEach((host) => {
    vidoHostConfig[host] = vido
  })
})

export function configuredApi(): string[] {
  return Object.values(vidos)
    .map((vido) => vido.API_ENDPOINT || [])
    .flat()
}

export function configuredImageProxy(): string[] {
  return Object.values(vidos)
    .map((vido) => vido.IMAGE_PROXY || [])
    .flat()
}

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
  if (!(host in vidoHostConfig)) {
    throw new Error(`Not configured host "${host}"`)
  }
  return {
    ...vidoHostConfig[host],
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
