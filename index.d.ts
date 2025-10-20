import type { VidoConfig } from './utils/types-config'

declare module '#app' {
  interface NuxtApp {
    $trackingInit: () => void
    $vidoConfigSet: (c: VidoConfig) => void
  }
}

export {}
