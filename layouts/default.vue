<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { siteStore as useSiteStore } from '~/stores/site'
import { headerFromSettings } from '~/lib/apiSettings'
import '~/assets/tailwind.scss'

const siteStore = useSiteStore()
const { config, settings, contents, translations } = storeToRefs(siteStore)

if (process.server)
  await siteStore.init()

if (!config.value)
  throw createError({ statusCode: 500, statusMessage: 'Wrong config', fatal: true })

if (!settings.value)
  throw createError({ statusCode: 500, statusMessage: 'Failed to fetch settings', fatal: true })

if (!contents.value)
  throw createError({ statusCode: 500, statusMessage: 'Failed to fetch contents', fatal: true })

if (!translations.value)
  throw createError({ statusCode: 500, statusMessage: 'Failed to fetch translations', fatal: true })

useHead(headerFromSettings(settings.value, { googleSiteVerification: config.value.GOOGLE_SITE_VERIFICATION }))
</script>

<template>
  <div class="v-locale--is-ltr">
    <slot />
  </div>
</template>
