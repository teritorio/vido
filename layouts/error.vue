<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { Settings } from '~/lib/apiSettings'
import { useSiteStore } from '~/stores/site'
import { vidoConfig } from '~/plugins/vido-config'

const { locale: i18nLocale } = useI18n()
const { config, settings, locale } = storeToRefs(useSiteStore())

if (process.server) {
  config.value = vidoConfig(useRequestHeaders())
}

if (!config.value)
  throw createError({ statusCode: 500, statusMessage: 'Wrong config', fatal: true })

const { apiEndpoint } = useApiEndpoint()
const { API_PROJECT, API_THEME } = config.value
const { data, error, status } = await useAsyncData('parallel', async () => $fetch<Settings>(`${apiEndpoint.value}/${API_PROJECT}/${API_THEME}/settings.json`))

if (error.value)
  throw createError(error.value)

if (status.value === 'success' && data.value) {
  settings.value = Object.assign(
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
    data.value,
  )
  locale.value = i18nLocale.value
}
</script>

<template>
  <div class="v-locale--is-ltr">
    <slot />
  </div>
</template>
