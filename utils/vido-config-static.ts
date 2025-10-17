import type { VidosConfig } from '~/utils/types-config'

export function configuredApi(vidos: () => VidosConfig, apiEndpoint?: string): string[] {
  return [
    ...new Set(
      Object.values(vidos())
        .map(_vido => apiEndpoint || [])
        .flat(),
    ),
  ].map(url => new URL(url).hostname)
}

export function configuredImageProxy(vidos: () => VidosConfig): string[] {
  return [
    ...new Set(
      Object.values(vidos())
        .map(vido => vido.IMAGE_PROXY || [])
        .flat(),
    ),
  ]
}
