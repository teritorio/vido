import { defineNuxtPlugin } from '#app/nuxt'
import { vidos } from '~/lib/config'
import { VidoConfig, VidosConfig } from '~/utils/types-config'

export function vidoConfigResolve(
  host: string,
  matchedHost: string,
  vidoHostConfig: VidosConfig
): VidoConfig {
  const vido = { ...vidoHostConfig[matchedHost] }
  if (matchedHost.startsWith('*.')) {
    vido.API_PROJECT = host.split('.')[1]
    vido.API_THEME = host.split('.')[0]
  }

  return vido
}

export function vidoConfig(
  headers: Record<string, string | undefined>
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

  const vidoHostConfig = vidos()
  const matchedHost = Object.keys(vidoHostConfig).find(
    (availableHost) =>
      availableHost == host ||
      (availableHost.startsWith('*.') &&
        host.endsWith(availableHost.substring(1)))
  )
  if (!matchedHost && !('' in vidoHostConfig)) {
    throw new Error(`Not matching host "${host}"`)
  }
  return vidoConfigResolve(host, matchedHost || '', vidoHostConfig)
}

export default defineNuxtPlugin((_nuxtApp) => {
  let config: VidoConfig | undefined

  return {
    provide: {
      vidoConfigSet: (c: VidoConfig): void => {
        config = c
      },
      vidoConfig: (
        headers: Readonly<Record<string, string | undefined>>
      ): VidoConfig => config || vidoConfig(headers),
    },
  }
})
