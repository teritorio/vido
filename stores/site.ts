import { defineStore } from 'pinia'
import { vidoConfig } from '~/plugins/vido-config'
import { type ContentEntry, getContents } from '~/lib/apiContent'
import { type PropertyTranslations, getPropertyTranslations } from '~/lib/apiPropertyTranslations'
import { type Settings, getSettings } from '~/lib/apiSettings'
import type { VidoConfig } from '~/utils/types-config'

enum PropertyTranslationsContextEnum {
  Default = 'label',
  Card = 'label_popup',
  Details = 'label_details',
  List = 'label_list',
}

const Default = PropertyTranslationsContextEnum.Default

interface State {
  locale: string | null
  config: VidoConfig | undefined
  explorerModeEnabled: boolean
  favoritesModeEnabled: boolean
  settings: Settings | undefined
  contents: ContentEntry[] | undefined
  translations: PropertyTranslations | undefined
}

export const siteStore = defineStore('site', {
  state: (): State => ({
    locale: null,
    config: undefined,
    explorerModeEnabled: false,
    favoritesModeEnabled: false,
    settings: undefined,
    contents: undefined,
    translations: undefined,
  }),
  actions: {
    async init(headers: Record<string, string>) {
      this.config = vidoConfig(headers)
      this.settings = await getSettings(this.config)
      this.explorerModeEnabled = this.settings?.themes[0]?.explorer_mode || true
      this.favoritesModeEnabled = this.settings?.themes[0]?.favorites_mode || true
      this.contents = await getContents(this.config)
      this.translations = await getPropertyTranslations(this.config)
    },
    p(propertyName: string, context: PropertyTranslationsContextEnum = Default): string {
      if (!this.translations)
        throw new Error('Missing translation, call siteStore.init() first.')

      const pn = this.translations[propertyName]

      // When context exists, does not use default
      return (
        pn?.[context]
          ? pn?.[context]?.fr
          : pn?.[Default]?.fr
      )
      || propertyName
    },
    pv(propertyName: string, valueName: string, context: PropertyTranslationsContextEnum = Default): string {
      if (!this.translations)
        throw new Error('Missing translation, call siteStore.init() first.')

      const pn = this.translations[propertyName]?.values?.[valueName]

      // When context exists, does not use default
      return (
        pn?.[context]
          ? pn?.[context]?.fr
          : pn?.[Default]?.fr
      )
      || valueName
    },
  },
})
