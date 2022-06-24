import { Plugin } from '@nuxt/types'

import { Settings } from '@/lib/apiSettings'

interface SettingsSetPlugin {
  set(settings: Settings): void
}

export interface SettingsPlugin extends Settings {
  set(settings: Settings): void
}

const settingsPlugin: Plugin = (_, inject) => {
  const settings: SettingsPlugin | SettingsSetPlugin = {
    set(setSettings: Settings): void {
      Object.assign(settings, setSettings)
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
