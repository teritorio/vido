import { defineNuxtPlugin } from '#app/nuxt'
import { NuxtRuntimeConfig } from '@nuxt/types/config/runtime'
import createServer from 'connect'

import { VidoConfig, VidosConfig } from '~/utils/types-config'

export function configuredApi(vidos: VidosConfig): string[] {
  return [
    ...new Set(
      Object.values(vidos)
        .map((vido) => vido.API_ENDPOINT || [])
        .flat()
    ),
  ].map((url) => new URL(url).hostname)
}

export function configuredImageProxy(vidos: VidosConfig): string[] {
  return [
    ...new Set(
      Object.values(vidos)
        .map((vido) => vido.IMAGE_PROXY || [])
        .flat()
    ),
  ]
}

export function vidoConfigResolve(
  host: string,
  vidoHostConfig: VidosConfig
): VidoConfig {
  return {
    ...(vidoHostConfig[host] || vidoHostConfig['']),
  }
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
      throw new Error(
        'No header "Host" nor "x-forwarded-host": ' +
          JSON.stringify(req.headers)
      )
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
  return vidoConfigResolve(host, vidoHostConfig)
}

export default defineNuxtPlugin((nuxtApp) => {
  let config: VidoConfig | undefined

  return {
    provide: {
      vidoConfigSet: (c: VidoConfig): void => {
        config = c
      },
      vidoConfig: (): VidoConfig => (
        config ||
        vidoConfig(nuxtApp.vueApp.context.req, nuxtApp.vueApp.$config)
      )
    }
  }
})
