<template>
  <client-only v-if="doNotTrack && $vidoConfig().COOKIES_CONSENT">
    <CookieLaw
      :button-text="$tc('cookiesConsent.accept')"
      :button-link="$vidoConfig().COOKIES_LINK"
      :button-link-text="$tc('cookiesConsent.details')"
      :button-link-new-tab="true"
      :button-decline="true"
      :button-decline-text="$tc('cookiesConsent.decline')"
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
import Vue from 'vue'

export default Vue.extend({
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
      this.$tracking_consent()
    },
  },
})
</script>
