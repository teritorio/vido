import { storeToRefs } from 'pinia'
import { defineNuxtPlugin, useRuntimeConfig } from '#app/nuxt'
import Google from '~/lib/tracker-google'
import Matomo from '~/lib/tracker-matomo'
import type { Event, Tracker } from '~/lib/trackers'
import { useSiteStore } from '~/stores/site'

export default defineNuxtPlugin((nuxtApp) => {
  const trackers: Tracker[] = []
  const { trackingEnabled, cypress } = useRuntimeConfig().public
  const { theme } = storeToRefs(useSiteStore())

  return {
    provide: {
      trackingInit: (): void => {
        if (navigator.doNotTrack !== '1' && trackingEnabled) {
          if (theme.value?.google_tag_manager_id) {
            const consentIsGranted = theme.value?.cookies_consent_message
              ? localStorage.getItem('vue-cookie-accept-decline-cookies-consent') === 'accept'
              : true // Bypass consent if cookies_consent_message is not enabled

            trackers.push(
              new Google(
                nuxtApp.vueApp,
                !consentIsGranted,
                theme.value.google_tag_manager_id,
              ),
            )
          }

          const matomoUrl = theme.value?.matomo_url
          const matomoIdsite = theme.value?.matomo_siteid

          if (matomoUrl && matomoIdsite) {
            trackers.push(
              new Matomo(
                nuxtApp.vueApp,
                Boolean(theme.value.cookies_consent_message),
                matomoUrl,
                matomoIdsite,
              ),
            )
          }
        }
      },

      tracking_consent: (): void => {
        if (trackers.length > 0) {
          trackers.forEach((tracker) => {
            tracker.consent(nuxtApp.vueApp)
          })
        }
      },

      tracking: (event: Event): void => {
        if (process.dev || cypress)
          console.error('Tracking event', event)

        trackers.forEach((tracker) => {
          tracker.track(nuxtApp.vueApp, event)
        })
      },
    },
  }
})
