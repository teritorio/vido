<script setup lang="ts">
import { storeToRefs } from 'pinia'
import VueCookieAcceptDecline from 'vue-cookie-accept-decline'
import 'vue-cookie-accept-decline/dist/vue-cookie-accept-decline.css'
import ExternalLink from '~/components/UI/ExternalLink.vue'
import { useSiteStore } from '~/stores/site'

const { theme } = storeToRefs(useSiteStore())

const doNotTrack = computed((): boolean => {
  return (
    (process.client && navigator && navigator.doNotTrack !== '1') || false
  )
})

if (!theme.value)
  throw createError({ statusCode: 400, statusMessage: 'Theme is missing', fatal: true })

const { $tracking_consent } = useNuxtApp()

function accept() {
  $tracking_consent()
}
</script>

<template>
  <client-only v-if="doNotTrack && theme!.cookies_consent_message">
    <VueCookieAcceptDecline
      element-id="cookies-consent"
      type="bar"
      position="bottom"
      @clicked-accept="accept"
    >
      <template #message>
        {{ theme!.cookies_consent_message.fr }}
        <ExternalLink
          v-if="theme!.cookies_usage_detail_url"
          :href="theme!.cookies_usage_detail_url"
          target="_blank"
        >
          {{ $t('cookiesConsent.details') }}
        </ExternalLink>
      </template>
      <template #declineContent>
        {{ $t('cookiesConsent.decline') }}
      </template>
      <template #acceptContent>
        {{ $t('cookiesConsent.accept') }}
      </template>
    </VueCookieAcceptDecline>
  </client-only>
</template>

<style>
.cookie__bar__buttons__button--accept,
.cookie__bar__buttons__button--decline,
.cookie__bar__buttons__button--accept:hover,
.cookie__bar__buttons__button--decline:hover {
  background: linear-gradient(#5cb860, #4caf50);
}
</style>
