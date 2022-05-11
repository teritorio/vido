import { Plugin } from '@nuxt/types'

import { Settings } from '@/lib/apiSettings'

interface SettingsSetPlugin {
  set(settings: Settings | null): void
}

export interface SettingsPlugin extends Settings {
  set(settings: Settings | null): void
}

const settingsPlugin: Plugin = (_, inject) => {
  const settings: SettingsPlugin | SettingsSetPlugin = {
    set(setSettings: Settings | null): void {
      if (setSettings) {
        Object.assign(settings, setSettings)
      }
    },
  }
  inject('settings', settings)
}

export default settingsPlugin

declare module 'vue/types/vue' {
  interface Vue {
    readonly $settings: SettingsPlugin
  }
}
