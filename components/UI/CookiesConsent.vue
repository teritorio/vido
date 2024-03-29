<script lang="ts">
import VueCookieAcceptDecline from 'vue-cookie-accept-decline'
import type { VidoConfig } from '~/utils/types-config'

import { defineNuxtComponent, useRequestHeaders } from '#app'
import 'vue-cookie-accept-decline/dist/vue-cookie-accept-decline.css'
import ExternalLink from '~/components/UI/ExternalLink.vue'
import { siteStore as useSiteStore } from '~/stores/site'

export default defineNuxtComponent({
  components: {
    VueCookieAcceptDecline,
    ExternalLink,
  },

  computed: {
    vidoConfig(): VidoConfig {
      return useSiteStore().config || this.$vidoConfig(useRequestHeaders())
    },

    doNotTrack(): boolean {
      return (
        (process.client && navigator && navigator.doNotTrack !== '1') || false
      )
    },
  },

  methods: {
    accept() {
      this.$tracking_consent()
    },
  },
})
</script>

<template>
  <client-only v-if="doNotTrack && vidoConfig.COOKIES_CONSENT">
    <VueCookieAcceptDecline
      element-id="cookies-consent"
      type="bar"
      position="bottom"
      @clicked-accept="accept"
    >
      <template #message>
        {{ vidoConfig.COOKIES_CONSENT }}
        <ExternalLink
          v-if="vidoConfig.COOKIES_LINK"
          :href="vidoConfig.COOKIES_LINK"
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
/* stylelint-disable selector-class-pattern */
.cookie__bar__buttons__button--accept,
.cookie__bar__buttons__button--decline,
.cookie__bar__buttons__button--accept:hover,
.cookie__bar__buttons__button--decline:hover {
  background: linear-gradient(#5cb860, #4caf50);
}
</style>
