import { defineStore } from 'pinia'
import type { Article } from '~/lib/apiArticle'
import type { PropertyTranslations } from '~/lib/apiPropertyTranslations'
import type { Settings, SiteInfosTheme } from '~/lib/apiSettings'
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

export const siteStore = defineStore('site', () => {
  const locale = ref<string>()
  const config = ref<VidoConfig>()
  const settings = ref<Settings>()
  const articles = ref<Article[]>([])
  const translations = ref<PropertyTranslations>()
  const theme = ref<SiteInfosTheme | undefined>(settings.value?.themes[0])
  const explorerModeEnabled = ref<SiteInfosTheme['explorer_mode']>(theme.value?.explorer_mode ?? true)
  const favoritesModeEnabled = ref<SiteInfosTheme['favorites_mode']>(theme.value?.favorites_mode ?? true)

  async function init(headers: Record<string, string>) {
    config.value = vidoConfig(headers)
    settings.value = await getSettings(config.value)
    translations.value = await getPropertyTranslations(config.value)
    const { data: articlesData, error: articlesError, status: articlesStatus } = await getArticles(config.value)

    if (articlesError.value)
      throw createError(articlesError.value)

    if (articlesStatus.value === 'success' && articlesData.value) {
      articles.value = articlesData.value
    }
  }

  function p(propertyName: string, context: PropertyTranslationsContextEnum = Default): string {
    if (!translations.value)
      throw new Error('Missing translation, call siteStore.init() first.')

    const pn = translations.value[propertyName]

    // When context exists, does not use default
    return (
      pn?.[context]
        ? pn?.[context]?.fr
        : pn?.[Default]?.fr
    )
    || propertyName
  }

  function pv(propertyName: string, valueName: string, context: PropertyTranslationsContextEnum = Default): string {
    if (!translations.value)
      throw new Error('Missing translation, call siteStore.init() first.')

    const pn = translations.value[propertyName]?.values?.[valueName]

    // When context exists, does not use default
    return (
      pn?.[context]
        ? pn?.[context]?.fr
        : pn?.[Default]?.fr
    )
    || valueName
  }

  return {
    locale,
    config,
    settings,
    articles,
    translations,
    theme,
    explorerModeEnabled,
    favoritesModeEnabled,
    init,
    p,
    pv,
  }
})
