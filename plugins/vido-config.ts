import { NuxtRuntimeConfig } from '@nuxt/types/config/runtime'

import { useRequestHeaders } from '#app'
import { defineNuxtPlugin, useNuxtApp } from '#app/nuxt'
import { VidoConfig, VidosConfig } from '~/utils/types-config'

export function vidoConfigResolve(
  host: string,
  vidoHostConfig: VidosConfig
): VidoConfig {
  return {
    ...(vidoHostConfig[host] || vidoHostConfig['']),
  }
}

export function vidoConfig(
  headers: Record<string, string | undefined>,
  privateRuntimeConfig: NuxtRuntimeConfig
): VidoConfig {
  let host: string
  if (process.server) {
    const hostHeader = (headers['x-forwarded-host'] as string) || headers.host
    if (!hostHeader) {
      throw new Error(
        'No header "Host" nor "x-forwarded-host": ' + JSON.stringify(headers)
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
      vidoConfig: (): VidoConfig =>
        config || vidoConfig(useRequestHeaders(), useNuxtApp().$config),
    },
  }
})
