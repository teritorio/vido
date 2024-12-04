import { defineNuxtPlugin, useRuntimeConfig } from '#app/nuxt'
import Google from '~/lib/tracker-google'
import Matomo from '~/lib/tracker-matomo'
import type { Event, Tracker } from '~/lib/trackers'
import type { VidoConfig } from '~/utils/types-config'

export default defineNuxtPlugin((nuxtApp) => {
  const trackers: Tracker[] = []

  return {
    provide: {
      trackingInit: (config: VidoConfig): void => {
        if (navigator.doNotTrack !== '1') {
          const consentIsGranted = localStorage.getItem('vue-cookie-accept-decline-cookies-consent') === 'accept'
          const googleTagManagerId = config.GOOGLE_TAG_MANAGER_ID

          if (googleTagManagerId) {
            trackers.push(
              new Google(
                nuxtApp.vueApp,
                !consentIsGranted,
                googleTagManagerId,
              ),
            )
          }

          const matomoUrl = config.MATOMO_URL
          const matomoIdsite = config.MATOMO_SITEID
          if (matomoUrl && matomoIdsite) {
            trackers.push(
              new Matomo(
                nuxtApp.vueApp,
                Boolean(config.COOKIES_CONSENT),
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
        if (process.dev || useRuntimeConfig().public.cypress)
          console.error('Tracking event', event)

        trackers.forEach((tracker) => {
          tracker.track(nuxtApp.vueApp, event)
        })
      },
    },
  }
})
