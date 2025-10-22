<script setup lang="ts">
import { storeToRefs } from 'pinia'
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

const { settings, theme } = storeToRefs(useSiteStore())

if (!settings.value)
  throw createError({ statusCode: 500, statusMessage: 'Failed to fetch settings', fatal: true })

const { t } = useI18n()
const { params } = useRoute()

const { data, error, status } = await getArticle(params.slug as string)

if (error.value)
  throw createError(error.value)

const content = ref<string>()
onMounted(() => {
  if (status.value === 'success' && data.value) {
    const parser = new DOMParser()
    const document = parser.parseFromString(data.value, 'text/html')
    const title = document.querySelector('title')?.textContent
    content.value = document.querySelector('body')?.innerHTML

    if (settings.value && theme.value) {
      useHead(
        headerFromSettings(
          theme.value,
          settings.value.icon_font_css_url,
          { title: title || undefined },
        ),
      )
    }
  }
})
</script>

<template>
  <VApp>
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
    <VContainer :style="{ maxWidth: '1200px' }">
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
      <Footer :attributions="settings?.attributions" />
    </VContainer>
  </VApp>
</template>

<style lang="scss" scoped>
@import '~/assets/details';

:deep(body) {
  color: $color-text;
  background-color: #fefefe;
  padding: 1rem;
  min-width: 21rem;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizelegibility;
  line-height: 1.3;
  word-wrap: break-word;

  @extend %font-light;
}

:deep(h1) {
  font-size: 2.4rem;
  text-align: center;
  margin: 0.6rem 0.3rem 0;
  text-transform: uppercase;
}

:deep(h2) {
  font-size: 1.8rem;
  margin-top: 0;
  margin-bottom: 0.7rem;
  text-transform: uppercase;
}

:deep(h3) {
  font-size: 1.2rem;
  margin-top: 1.2rem;
  margin-bottom: 0.7rem;
}

:deep(a) {
  text-decoration: underline;
}
</style>
