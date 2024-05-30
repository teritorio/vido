<script lang="ts">
import { mapState } from 'pinia'
import VueCookieAcceptDecline from 'vue-cookie-accept-decline'
import { defineNuxtComponent } from '#app'
import 'vue-cookie-accept-decline/dist/vue-cookie-accept-decline.css'
import ExternalLink from '~/components/UI/ExternalLink.vue'
import { siteStore as useSiteStore } from '~/stores/site'

export default defineNuxtComponent({
  components: {
    VueCookieAcceptDecline,
    ExternalLink,
  },

  computed: {
    ...mapState(useSiteStore, ['config']),
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
  <client-only v-if="doNotTrack && config!.COOKIES_CONSENT">
    <VueCookieAcceptDecline
      element-id="cookies-consent"
      type="bar"
      position="bottom"
      @clicked-accept="accept"
    >
      <template #message>
        {{ config!.COOKIES_CONSENT }}
        <ExternalLink
          v-if="config!.COOKIES_LINK"
          :href="config!.COOKIES_LINK"
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
