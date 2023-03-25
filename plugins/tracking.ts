import { defineNuxtPlugin } from '#app/nuxt'
import Google from '~/lib/tracker-google'
import Matomo from '~/lib/tracker-matomo'
import { Event, Tracker } from '~/lib/trackers'
import { VidoConfig } from '~/utils/types-config'

export default defineNuxtPlugin((nuxtApp) => {
  const trackers: Tracker[] = []

  return {
    provide: {
      trackingInit: (config: VidoConfig): void => {
        if (navigator.doNotTrack !== '1') {
          const googleTagManagerId = config.GOOGLE_TAG_MANAGER_ID
          if (googleTagManagerId) {
            trackers.push(
              new Google(
                nuxtApp,
                Boolean(config.COOKIES_CONSENT),
                googleTagManagerId
              )
            )
          }

          const matomoUrl = config.MATOMO_URL
          const matomoIdsite = config.MATOMO_SITEID
          if (matomoUrl && matomoIdsite) {
            trackers.push(
              new Matomo(
                nuxtApp,
                Boolean(config.COOKIES_CONSENT),
                matomoUrl,
                matomoIdsite
              )
            )
          }
        }
      },

      tracking_consent: (): void => {
        if (trackers.length > 0) {
          trackers.forEach((tracker) => {
            tracker.consent()
          })
        }
      },

      tracking: (event: Event): void => {
        if (process.env.environment === 'development') {
          console.error('Tracking event', event)
        }

        trackers.forEach((tracker) => {
          tracker.track(event)
        })
      },
    },
  }
})
