<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { siteStore as useSiteStore } from '~/stores/site'
import { menuStore as useMenuStore } from '~/stores/menu'
import { headerFromSettings } from '~/lib/apiSettings'
import '~/assets/tailwind.scss'

const { locale: i18nLocale } = useI18n()
const siteStore = useSiteStore()
const { config, settings, contents, translations, locale } = storeToRefs(siteStore)
const menuStore = useMenuStore()
const { menuItems } = storeToRefs(menuStore)

if (process.server) {
  await siteStore.init(useRequestHeaders())

  if (!config.value)
    throw createError({ statusCode: 500, statusMessage: 'Wrong config', fatal: true })

  await menuStore.init(config.value)
}

if (!menuItems?.value)
  throw createError({ statusCode: 404, statusMessage: 'Menu not found', fatal: true })

if (!settings.value)
  throw createError({ statusCode: 500, statusMessage: 'Failed to fetch settings', fatal: true })

if (!contents.value)
  throw createError({ statusCode: 500, statusMessage: 'Failed to fetch contents', fatal: true })

if (!translations.value)
  throw createError({ statusCode: 500, statusMessage: 'Failed to fetch translations', fatal: true })

useHead(headerFromSettings(settings.value, { googleSiteVerification: config.value!.GOOGLE_SITE_VERIFICATION }))
locale.value = i18nLocale.value
</script>

<template>
  <div class="v-locale--is-ltr">
    <slot />
  </div>
</template>
