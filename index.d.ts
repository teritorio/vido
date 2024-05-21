import type { PropertyTranslationsPlugin } from './plugins/property-translations'
import type { SettingsPlugin } from './plugins/settings'
import type { VidoConfig } from './utils/types-config'

declare module '#app' {
  interface NuxtApp {
    $propertyTranslations: PropertyTranslationsPlugin
    $settings: SettingsPlugin
    $trackingInit: (config: VidoConfig) => void
    $vidoConfigSet: (c: VidoConfig) => void
  }
}

export {}
