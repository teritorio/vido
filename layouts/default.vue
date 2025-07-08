<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { Settings } from '~/lib/apiSettings'
import type { PropertyTranslations } from '~/lib/apiPropertyTranslations'
import type { Article } from '~/lib/apiArticle'
import type { MenuItem } from '~/lib/apiMenu'
import { useSiteStore } from '~/stores/site'
import { menuStore as useMenuStore } from '~/stores/menu'
import { headerFromSettings } from '~/lib/apiSettings'
import { vidoConfig } from '~/plugins/vido-config'
import '~/assets/tailwind.scss'

const { locale: i18nLocale } = useI18n()
const siteStore = useSiteStore()
const menuStore = useMenuStore()

const { config, settings, translations, articles, locale } = storeToRefs(siteStore)

if (process.server) {
  config.value = vidoConfig(useRequestHeaders())
}

if (!config.value)
  throw createError({ statusCode: 500, statusMessage: 'Wrong config', fatal: true })

const { API_ENDPOINT, API_PROJECT, API_THEME, GOOGLE_SITE_VERIFICATION } = config.value
const { data, error, status } = await useAsyncData('parallel', async () => {
  const [settings, menu, translations, articles] = await Promise.all([
    $fetch<Settings>(`${API_ENDPOINT}/${API_PROJECT}/${API_THEME}/settings.json`),
    $fetch<MenuItem[]>(`${API_ENDPOINT}/${API_PROJECT}/${API_THEME}/menu.json`),
    $fetch<PropertyTranslations>(`${API_ENDPOINT}/${API_PROJECT}/${API_THEME}/attribute_translations/fr.json`),
    // INFO: slug query param is here only for WP API backward compatibility
    $fetch<Article[]>(`${API_ENDPOINT}/${API_PROJECT}/${API_THEME}/articles.json?slug=non-classe`),
  ])

  menuStore.fetchConfig(menu)

  return {
    articles,
    settings: Object.assign(
      {
        id: 0,
        slug: '',
        name: '',
        attribution: [],
        icon_font_css_url: '',
        bbox_line: {
          type: 'LineString',
          coordinates: [
            [1.43862, 42.41845],
            [1.68279, 42.6775],
          ],
        },
        themes: [],
      },
      settings,
    ),
    translations,
  }
})

if (error.value) {
  throw createError(error.value)
}

if (status.value === 'success' && data.value) {
  settings.value = data.value.settings
  translations.value = data.value.translations
  articles.value = data.value.articles
  locale.value = i18nLocale.value

  useHead(headerFromSettings(settings.value, { googleSiteVerification: GOOGLE_SITE_VERIFICATION }))
}
</script>

<template>
  <div class="v-locale--is-ltr">
    <slot />
  </div>
</template>

<style lang="css">
.v-tooltip > .v-overlay__content {
  font-size: 1rem;
}
</style>
