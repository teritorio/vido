<script setup lang="ts">
import Header from '~/components/Layout/Header.vue'
import Footer from '~/components/Layout/Footer.vue'
import IconButton from '~/components/UI/IconButton.vue'
import TeritorioIcon from '~/components/UI/TeritorioIcon.vue'
import { useSiteStore } from '~/stores/site'
import { getArticle } from '~/lib/apiArticle'
import { headerFromSettings } from '~/lib/apiSettings'

definePageMeta({
  validate({ params }) {
    return !!params.slug
  },
})

const { config, settings } = useSiteStore()

if (!config)
  throw createError({ statusCode: 500, statusMessage: 'Wrong config', fatal: true })

if (!settings)
  throw createError({ statusCode: 500, statusMessage: 'Failed to fetch settings', fatal: true })

const { t } = useI18n()
const { params } = useRoute()

const { data, error, status } = await getArticle(config, params.slug as string)

if (error.value)
  throw createError(error.value)

const content = ref<string>()
onMounted(() => {
  if (status.value === 'success' && data.value) {
    const parser = new DOMParser()
    const document = parser.parseFromString(data.value, 'text/html')
    const title = document.querySelector('title')?.textContent
    content.value = document.querySelector('body')?.innerHTML
    useHead(headerFromSettings(settings, { title: title || undefined }))
  }
})
</script>

<template>
  <VContainer>
    <VAlert
      v-if="error"
      :closable="true"
      :style="{ zIndex: 999 }"
      :text="error.message"
      location="top center"
      position="fixed"
      type="error"
      variant="elevated"
    />
    <Header class="mb-4">
      <IconButton
        :label="t('poiCard.backToMap')"
        :title="t('poiCard.backToMap')"
        href="/"
        class="tw-w-11 tw-h-11 tw-mr-3 sm:tw-mr-9"
      >
        <TeritorioIcon picto="map" class="tw-text-zinc-800" />
      </IconButton>
    </Header>
    <ClientOnly>
      <p v-html="content" />
    </ClientOnly>
    <Footer :attributions="settings.attributions" />
  </VContainer>
</template>
