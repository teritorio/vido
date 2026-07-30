<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSiteStore } from '~/stores/site'
import type { LanguageCode } from '~/utils/types'

const siteStore = useSiteStore()
const { theme } = storeToRefs(siteStore)
const { locale, t } = useI18n()

const dismissed = ref(false)

const message = computed((): string | undefined => {
  const msg = theme.value?.emergency_message
  if (!msg)
    return undefined
  const lang = locale.value.substring(0, 2) as LanguageCode
  return msg[lang] ?? msg.fr
})

const url = computed((): string | undefined => theme.value?.emergency_url)

const isExternalUrl = computed((): boolean =>
  !!url.value && (url.value.startsWith('http://') || url.value.startsWith('https://')),
)
</script>

<template>
  <div
    v-if="!dismissed && message"
    class="tw-fixed tw-top-0 tw-left-0 tw-w-full tw-z-50 tw-bg-amber-500 tw-text-white tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-2 tw-gap-4"
    role="alert"
  >
    <span class="tw-flex-1 tw-text-sm tw-font-medium">{{ message }}</span>
    <div class="tw-flex tw-items-center tw-gap-2 tw-shrink-0">
      <a
        v-if="url && isExternalUrl"
        :href="url"
        target="_blank"
        rel="noopener noreferrer"
        class="tw-text-sm tw-font-semibold tw-underline tw-text-white hover:tw-text-amber-100"
      >
        {{ t('emergencyBanner.action') }}
      </a>
      <NuxtLink
        v-else-if="url"
        :to="url"
        target="_self"
        class="tw-text-sm tw-font-semibold tw-underline tw-text-white hover:tw-text-amber-100"
      >
        {{ t('emergencyBanner.action') }}
      </NuxtLink>
      <button
        type="button"
        class="tw-text-white tw-text-lg tw-leading-none tw-font-bold tw-bg-transparent tw-border-0 tw-cursor-pointer hover:tw-text-amber-100 focus:tw-outline-none"
        :aria-label="t('emergencyBanner.dismiss')"
        @click="dismissed = true"
      >
        ✕
      </button>
    </div>
  </div>
</template>
