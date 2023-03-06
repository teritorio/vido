<template>
  <client-only v-if="doNotTrack && $vidoConfig().COOKIES_CONSENT">
    <CookieLaw
      :button-text="$t('cookiesConsent.accept')"
      :button-link="$vidoConfig().COOKIES_LINK"
      :button-link-text="$t('cookiesConsent.details')"
      :button-link-new-tab="true"
      :button-decline="true"
      :button-decline-text="$t('cookiesConsent.decline')"
      button-decline-class="Cookie__button"
      @accept="accept"
    >
      <template #message>
        {{ $vidoConfig().COOKIES_CONSENT }}
      </template>
    </CookieLaw>
  </client-only>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { useNuxtApp } from '#app'

export default defineComponent({
  components: {
    // @ts-ignore
    CookieLaw: () => (process.client ? import('vue-cookie-law') : null),
  },

  computed: {
    doNotTrack(): boolean {
      return (
        (process.client && navigator && navigator.doNotTrack !== '1') || false
      )
    },
  },

  methods: {
    accept() {
      const { $tracking_consent } = useNuxtApp()
      $tracking_consent()
    },
  },
})
</script>
