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

export const useSiteStore = defineStore('site', () => {
  const locale = ref<string>()
  const config = ref<VidoConfig>()
  const settings = ref<Settings>()
  const articles = ref<Article[]>([])
  const translations = ref<PropertyTranslations>()

  const theme = computed(() => {
    if (!config.value)
      return undefined

    return settings.value?.themes.find(t => t.slug === config.value!.API_THEME)
  })

  const siteName = computed(() => {
    return theme.value?.title.fr || ''
  })

  const logoUrl = computed(() => {
    return theme.value?.logo_url || ''
  })

  const mainUrl = computed(() => {
    return theme.value?.main_url?.fr || '/'
  })

  const explorerModeEnabled = ref(theme.value?.explorer_mode ?? true)

  const favoritesModeEnabled = ref(theme.value?.favorites_mode ?? true)

  // TODO: Looks unused maybe remove ?
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
    logoUrl,
    mainUrl,
    siteName,
    explorerModeEnabled,
    favoritesModeEnabled,
    init,
    p,
    pv,
  }
})
