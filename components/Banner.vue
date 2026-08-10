<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSiteStore } from '~/stores/site'
import type { LanguageCode } from '~/utils/types'

const siteStore = useSiteStore()
const { theme } = storeToRefs(siteStore)
const { locale, t } = useI18n()

const dismissed = useState('bannerDismissed', () => false)

const message = computed((): string | undefined => {
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
