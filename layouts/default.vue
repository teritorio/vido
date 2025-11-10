<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { Settings } from '~/lib/apiSettings'
import type { PropertyTranslations } from '~/lib/apiPropertyTranslations'
import type { Article } from '~/lib/apiArticle'
import type { MenuItem } from '~/lib/apiMenu'
import { useSiteStore } from '~/stores/site'
import { menuStore as useMenuStore } from '~/stores/menu'
import { headerFromSettings } from '~/lib/apiSettings'
import '~/assets/tailwind.scss'

const { detectHost } = useHostDetection()

const { data: context, error: configError } = await useFetch('/api/config', {
  headers: {
    'x-client-host': detectHost(),
  },
})

if (configError.value) {
  showError({ ...configError.value })
}

const apiEndpoint = useState('api-endpoint', () => context.value?.api)
useState('project', () => context.value?.project)
useState('theme', () => context.value?.theme)
const { locale: i18nLocale } = useI18n()
const siteStore = useSiteStore()
const menuStore = useMenuStore()
const { settings, theme, translations, articles, locale } = storeToRefs(siteStore)

const { data, error, status } = await useAsyncData('parallel', async () => {
  const [settings, menu, translations, articles] = await Promise.all([
    $fetch<Settings>(`${apiEndpoint.value}/settings.json`),
    $fetch<MenuItem[]>(`${apiEndpoint.value}/menu.json`),
    $fetch<PropertyTranslations>(`${apiEndpoint.value}/attribute_translations/fr.json`),
    // INFO: slug query param is here only for WP API backward compatibility
    $fetch<Article[]>(`${apiEndpoint.value}/articles.json?slug=non-classe`),
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
        themes: {},
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

  if (settings.value && theme.value) {
    useHead(
      headerFromSettings(
        theme.value,
        settings.value.icon_font_css_url,
      ),
    )
  }
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
