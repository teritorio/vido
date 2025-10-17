import type { VidosConfig } from '~/utils/types-config'

export function configuredApi(vidos: () => VidosConfig): string[] {
  const { apiEndpoint } = useApiEndpoint()

  return [
    ...new Set(
      Object.values(vidos())
        .map(_vido => apiEndpoint.value || [])
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
