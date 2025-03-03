import { defineStore } from 'pinia'
import type { Article } from '~/lib/apiArticle'
import type { PropertyTranslations } from '~/lib/apiPropertyTranslations'
import type { Settings } from '~/lib/apiSettings'
import type { VidoConfig } from '~/utils/types-config'
import { getArticles } from '~/lib/apiArticle'
import { getPropertyTranslations } from '~/lib/apiPropertyTranslations'
import { getSettings } from '~/lib/apiSettings'
import { vidoConfig } from '~/plugins/vido-config'

export enum PropertyTranslationsContextEnum {
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
  articles: Article[] | undefined
  translations: PropertyTranslations | undefined
}

export const siteStore = defineStore('site', {
  state: (): State => ({
    locale: null,
    config: undefined,
    explorerModeEnabled: false,
    favoritesModeEnabled: false,
    settings: undefined,
    articles: undefined,
    translations: undefined,
  }),
  actions: {
    async init(headers: Record<string, string>) {
      this.config = vidoConfig(headers)
      this.settings = await getSettings(this.config)
      this.explorerModeEnabled = this.settings?.themes[0]?.explorer_mode || true
      this.favoritesModeEnabled = this.settings?.themes[0]?.favorites_mode || true
      this.articles = await getArticles(this.config)
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
