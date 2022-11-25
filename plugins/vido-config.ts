import { Plugin } from '@nuxt/types'
import { NuxtRuntimeConfig } from '@nuxt/types/config/runtime'
import createServer from 'connect'

import { VidoConfig, VidosConfig } from '~/utils/types-config'

export function configuredApi(vidos: VidosConfig): string[] {
  return Object.values(vidos)
    .map((vido) => vido.API_ENDPOINT || [])
    .flat()
}

export function configuredImageProxy(vidos: VidosConfig): string[] {
  return Object.values(vidos)
    .map((vido) => vido.IMAGE_PROXY || [])
    .flat()
}

export function vidoConfig(
  req: createServer.IncomingMessage,
  privateRuntimeConfig: NuxtRuntimeConfig
): VidoConfig {
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

  const vidoHostConfig = privateRuntimeConfig.vidos as VidosConfig
  if (!(host in vidoHostConfig) && !('' in vidoHostConfig)) {
    throw new Error(`Not configured host "${host}"`)
  }
  return {
    ...(vidoHostConfig[host] || vidoHostConfig['']),
  }
}

const vidosConfigPlugin: Plugin = ({ req, $config }, inject) => {
  let config: VidoConfig | undefined
  inject('vidoConfigSet', (c: VidoConfig) => {
    config = c
  })
  inject('vidoConfig', () => config || vidoConfig(req, $config))
}

export default vidosConfigPlugin

declare module 'vue/types/vue' {
  interface Vue {
    readonly $vidoConfigSet: (c: VidoConfig) => void
    readonly $vidoConfig: () => VidoConfig
  }
}
