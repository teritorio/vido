import type { VidoConfig } from './utils/types-config'

declare module '#app' {
  interface NuxtApp {
    $trackingInit: (config: VidoConfig) => void
    $vidoConfigSet: (c: VidoConfig) => void
  }
}

export {}
