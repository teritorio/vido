import { defineStore } from 'pinia'
import type { Article } from '~/lib/apiArticle'
import type { PropertyTranslations } from '~/lib/apiPropertyTranslations'
import type { Settings } from '~/lib/apiSettings'

export enum PropertyTranslationsContextEnum {
  Default = 'label',
  Card = 'label_popup',
  Details = 'label_details',
  List = 'label_list',
}

const Default = PropertyTranslationsContextEnum.Default

export const useSiteStore = defineStore('site', () => {
  const locale = ref<string>()
  const settings = ref<Settings>()
  const articles = ref<Article[]>([])
  const translations = ref<PropertyTranslations>()
  const themeSlug = useState<string>('theme')

  const theme = computed(() => {
    if (!settings.value?.themes)
      return undefined

    return settings.value.themes[themeSlug.value]
  })

  const siteName = computed(() => theme.value?.title.fr ?? '')

  const logoUrl = computed(() => theme.value?.logo_url ?? '')

  const mainUrl = computed(() => theme.value?.main_url?.fr ?? '/')

  const explorerModeEnabled = ref(true)

  const favoritesModeEnabled = ref(true)

  watch(theme, (newTheme) => {
    if (newTheme) {
      if ('explorer_mode' in newTheme) {
        explorerModeEnabled.value = newTheme.explorer_mode
      }
      if ('favorites_mode' in newTheme) {
        favoritesModeEnabled.value = newTheme.favorites_mode
      }
    }
  }, { immediate: true })

  function setExplorerMode(value: boolean) {
    explorerModeEnabled.value = value
  }

  function setFavoritesMode(value: boolean) {
    favoritesModeEnabled.value = value
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
    settings,
    articles,
    translations,
    theme,
    logoUrl,
    mainUrl,
    siteName,
    explorerModeEnabled,
    favoritesModeEnabled,
    setFavoritesMode,
    setExplorerMode,
    p,
    pv,
  }
})
