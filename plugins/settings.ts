import { defineNuxtPlugin } from '#app/nuxt'
import { Settings } from '~/lib/apiSettings'

interface SettingsSetPlugin {
  set(settings: Settings): void
}

export interface SettingsPlugin extends Settings {
  set(settings: Settings): void
}

export default defineNuxtPlugin((nuxtApp) => {
  const settings: SettingsPlugin | SettingsSetPlugin = {
    set(setSettings: Settings): void {
      Object.assign(settings, setSettings)
    },
  }

  return {
    provide: {
      settings: settings as SettingsPlugin,
    },
  }
})
