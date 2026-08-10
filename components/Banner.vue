<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSiteStore } from '~/stores/site'
import type { LanguageCode } from '~/utils/types'
import devLogo from '~/assets/logo-teritorio.png'

const siteStore = useSiteStore()
const { theme } = storeToRefs(siteStore)
const { locale, t } = useI18n()

const dismissed = useState('bannerDismissed', () => false)

const message = computed((): string | undefined => {
  if (import.meta.dev) {
    return `<div style="display:flex;gap:12px;align-items:flex-start;padding:12px 2.5rem 12px 16px">
  <img src="${devLogo}" style="width:48px;height:48px;object-fit:contain;flex-shrink:0" alt="Logo">
  <div>
    <strong style="display:block;font-size:1rem;margin-bottom:4px">Interruption de service ce soir</strong>
    <span style="display:block;font-size:0.875rem;margin-bottom:8px">Le service sera interrompu ce soir de 22h à 23h pour maintenance. Merci de votre compréhension.</span>
    <a href="https://exemple.fr" style="font-size:0.875rem;color:inherit;text-decoration:underline">En savoir plus →</a>
  </div>
</div>`
  }
  const msg = theme.value?.banner_message
  if (!msg)
    return undefined
  const lang = locale.value.substring(0, 2) as LanguageCode
  return msg[lang] ?? msg.fr
})

const dismissible = computed((): boolean => theme.value?.banner_dismissible ?? true)
</script>

<template>
  <div
    v-if="!dismissed && message"
    class="tw-relative"
    role="alert"
  >
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="message" />
    <button
      v-if="dismissible"
      type="button"
      class="tw-absolute tw-top-2 tw-right-2 tw-text-lg tw-leading-none tw-font-bold tw-bg-transparent tw-border-0 tw-cursor-pointer focus:tw-outline-none"
      :aria-label="t('banner.dismiss')"
      @click="dismissed = true"
    >
      ✕
    </button>
  </div>
</template>
