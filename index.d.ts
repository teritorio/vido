import type { PropertyTranslationsPlugin } from './plugins/property-translations'
import type { VidoConfig } from './utils/types-config'

declare module '#app' {
  interface NuxtApp {
    $propertyTranslations: PropertyTranslationsPlugin
    $trackingInit: (config: VidoConfig) => void
    $vidoConfigSet: (c: VidoConfig) => void
  }
}

export {}
